import { BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts"
import {
    TokenAllocationClaimed,
    CapitalRefunded,
    CapitalInvested,
    SaleEnded,
    CapitalRaisedPublished,
    SaleResultsPublished
} from "../generated/LegionPreLiquidSaleV2/LegionPreLiquidSaleV2"
import { TokenClaim, Refund, Investment, SaleStatus, InvestorSummary, RefundTotals, InvestmentTotals, ClaimTotals, UserCounters } from "../generated/schema"

function getOrCreateInvestorSummary(address: Bytes): InvestorSummary {
    let summary = InvestorSummary.load(address.toHexString())
    if (summary == null) {
        summary = new InvestorSummary(address.toHexString())
        summary.address = address
        summary.totalClaimed = BigInt.fromI32(0)
        summary.totalRefunded = BigInt.fromI32(0)
        summary.totalInvested = BigInt.fromI32(0)
        summary.claimCount = BigInt.fromI32(0)
        summary.refundCount = BigInt.fromI32(0)
        summary.investmentCount = BigInt.fromI32(0)
        summary.firstActivity = BigInt.fromI32(0)
        summary.lastActivity = BigInt.fromI32(0)
    }
    return summary
}

function updateInvestorActivity(summary: InvestorSummary, timestamp: BigInt): void {
    if (summary.firstActivity.equals(BigInt.fromI32(0))) {
        summary.firstActivity = timestamp
    }
    if (timestamp.gt(summary.lastActivity)) {
        summary.lastActivity = timestamp
    }
}

function getOrCreateRefundTotals(): RefundTotals {
    let totals = RefundTotals.load("refund-totals")
    if (totals == null) {
        totals = new RefundTotals("refund-totals")
        totals.totalRefunded = BigInt.fromI32(0)
        totals.totalRefundCount = BigInt.fromI32(0)
        totals.uniqueRefundAddresses = BigInt.fromI32(0)
        totals.lastUpdated = BigInt.fromI32(0)
    }
    return totals
}

function getOrCreateInvestmentTotals(): InvestmentTotals {
    let totals = InvestmentTotals.load("investment-totals")
    if (totals == null) {
        totals = new InvestmentTotals("investment-totals")
        totals.totalInvested = BigInt.fromI32(0)
        totals.totalInvestmentCount = BigInt.fromI32(0)
        totals.uniqueInvestorAddresses = BigInt.fromI32(0)
        totals.lastUpdated = BigInt.fromI32(0)
    }
    return totals
}

function getOrCreateClaimTotals(): ClaimTotals {
    let totals = ClaimTotals.load("claim-totals")
    if (totals == null) {
        totals = new ClaimTotals("claim-totals")
        totals.totalClaimed = BigInt.fromI32(0)
        totals.totalClaimCount = BigInt.fromI32(0)
        totals.uniqueClaimerAddresses = BigInt.fromI32(0)
        totals.lastUpdated = BigInt.fromI32(0)
    }
    return totals
}

function updateRefundTotals(amount: BigInt, address: Bytes, timestamp: BigInt): void {
    let totals = getOrCreateRefundTotals()
    totals.totalRefunded = totals.totalRefunded.plus(amount)
    totals.totalRefundCount = totals.totalRefundCount.plus(BigInt.fromI32(1))

    // Check if this is a new address for refunds
    let summary = InvestorSummary.load(address.toHexString())
    if (summary == null || summary.refundCount.equals(BigInt.fromI32(0))) {
        totals.uniqueRefundAddresses = totals.uniqueRefundAddresses.plus(BigInt.fromI32(1))
    }

    totals.lastUpdated = timestamp
    totals.save()
}

function updateInvestmentTotals(amount: BigInt, address: Bytes, timestamp: BigInt): void {
    let totals = getOrCreateInvestmentTotals()
    totals.totalInvested = totals.totalInvested.plus(amount)
    totals.totalInvestmentCount = totals.totalInvestmentCount.plus(BigInt.fromI32(1))

    // Check if this is a new address for investments
    let summary = InvestorSummary.load(address.toHexString())
    if (summary == null || summary.investmentCount.equals(BigInt.fromI32(0))) {
        totals.uniqueInvestorAddresses = totals.uniqueInvestorAddresses.plus(BigInt.fromI32(1))
    }

    totals.lastUpdated = timestamp
    totals.save()
}

function updateClaimTotals(amount: BigInt, address: Bytes, timestamp: BigInt): void {
    let totals = getOrCreateClaimTotals()
    totals.totalClaimed = totals.totalClaimed.plus(amount)
    totals.totalClaimCount = totals.totalClaimCount.plus(BigInt.fromI32(1))

    // Check if this is a new address for claims
    let summary = InvestorSummary.load(address.toHexString())
    if (summary == null || summary.claimCount.equals(BigInt.fromI32(0))) {
        totals.uniqueClaimerAddresses = totals.uniqueClaimerAddresses.plus(BigInt.fromI32(1))
    }

    totals.lastUpdated = timestamp
    totals.save()
}

function getOrCreateUserCounters(): UserCounters {
    let counters = UserCounters.load("user-counters")
    if (counters == null) {
        counters = new UserCounters("user-counters")
        counters.totalInvestmentUsers = BigInt.fromI32(0)
        counters.totalRefundUsers = BigInt.fromI32(0)
        counters.totalClaimUsers = BigInt.fromI32(0)
        counters.lastUpdated = BigInt.fromI32(0)
    }
    return counters
}

function updateUserCounters(address: Bytes, action: string, timestamp: BigInt): void {
    let counters = getOrCreateUserCounters()
    let summary = InvestorSummary.load(address.toHexString())

    if (action == "investment") {
        // Check if this is a new investment user
        if (summary == null || summary.investmentCount.equals(BigInt.fromI32(0))) {
            counters.totalInvestmentUsers = counters.totalInvestmentUsers.plus(BigInt.fromI32(1))
        }
    } else if (action == "refund") {
        // Check if this is a new refund user
        if (summary == null || summary.refundCount.equals(BigInt.fromI32(0))) {
            counters.totalRefundUsers = counters.totalRefundUsers.plus(BigInt.fromI32(1))
        }
    } else if (action == "claim") {
        // Check if this is a new claim user
        if (summary == null || summary.claimCount.equals(BigInt.fromI32(0))) {
            counters.totalClaimUsers = counters.totalClaimUsers.plus(BigInt.fromI32(1))
        }
    }

    counters.lastUpdated = timestamp
    counters.save()
}

export function handleTokenAllocationClaimed(event: TokenAllocationClaimed): void {
    let claim = new TokenClaim(
        event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
    )

    claim.investor = event.params.investor
    claim.amount = event.params.amount
    claim.blockNumber = event.block.number
    claim.transactionHash = event.transaction.hash
    claim.timestamp = event.block.timestamp
    claim.gasPrice = event.transaction.gasPrice
    claim.save()

    // Update investor summary
    let summary = getOrCreateInvestorSummary(event.params.investor)
    summary.totalClaimed = summary.totalClaimed.plus(event.params.amount)
    summary.claimCount = summary.claimCount.plus(BigInt.fromI32(1))
    summary.lastClaimed = event.block.timestamp
    updateInvestorActivity(summary, event.block.timestamp)
    summary.save()

    // Update claim totals
    updateClaimTotals(event.params.amount, event.params.investor, event.block.timestamp)

    // Update user counters
    updateUserCounters(event.params.investor, "claim", event.block.timestamp)
}

export function handleCapitalRefunded(event: CapitalRefunded): void {
    let refund = new Refund(
        event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
    )

    refund.investor = event.params.investor
    refund.amount = event.params.amount
    refund.blockNumber = event.block.number
    refund.transactionHash = event.transaction.hash
    refund.timestamp = event.block.timestamp
    refund.gasPrice = event.transaction.gasPrice
    refund.save()

    // Update investor summary
    let summary = getOrCreateInvestorSummary(event.params.investor)
    summary.totalRefunded = summary.totalRefunded.plus(event.params.amount)
    summary.refundCount = summary.refundCount.plus(BigInt.fromI32(1))
    summary.lastRefunded = event.block.timestamp
    updateInvestorActivity(summary, event.block.timestamp)
    summary.save()

    // Update refund totals
    updateRefundTotals(event.params.amount, event.params.investor, event.block.timestamp)

    // Update user counters
    updateUserCounters(event.params.investor, "refund", event.block.timestamp)
}

export function handleCapitalInvested(event: CapitalInvested): void {
    let investment = new Investment(
        event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
    )

    investment.investor = event.params.investor
    investment.amount = event.params.amount
    investment.blockNumber = event.block.number
    investment.transactionHash = event.transaction.hash
    investment.timestamp = event.params.investTimestamp.gt(BigInt.fromI32(0)) ? event.params.investTimestamp : event.block.timestamp
    investment.gasPrice = event.transaction.gasPrice
    investment.save()

    // Update investor summary
    let summary = getOrCreateInvestorSummary(event.params.investor)
    summary.totalInvested = summary.totalInvested.plus(event.params.amount)
    summary.investmentCount = summary.investmentCount.plus(BigInt.fromI32(1))
    summary.lastInvested = investment.timestamp
    updateInvestorActivity(summary, investment.timestamp)
    summary.save()

    // Update investment totals
    updateInvestmentTotals(event.params.amount, event.params.investor, investment.timestamp)

    // Update user counters
    updateUserCounters(event.params.investor, "investment", investment.timestamp)
}

export function handleSaleEnded(event: SaleEnded): void {
    let saleStatus = getOrCreateSaleStatus()
    saleStatus.hasEnded = true
    saleStatus.endTime = event.params.endTime
    saleStatus.lastUpdated = event.block.timestamp
    saleStatus.save()
}

export function handleCapitalRaisedPublished(event: CapitalRaisedPublished): void {
    let saleStatus = getOrCreateSaleStatus()
    saleStatus.totalCapitalRaised = event.params.capitalRaised
    saleStatus.lastUpdated = event.block.timestamp
    saleStatus.save()
}

export function handleSaleResultsPublished(event: SaleResultsPublished): void {
    let saleStatus = getOrCreateSaleStatus()
    saleStatus.claimTokensMerkleRoot = event.params.claimMerkleRoot
    saleStatus.totalTokensAllocated = event.params.tokensAllocated
    saleStatus.askToken = event.params.tokenAddress
    saleStatus.vestingStartTime = event.params.vestingStartTime
    saleStatus.lastUpdated = event.block.timestamp
    saleStatus.save()
}

function getOrCreateSaleStatus(): SaleStatus {
    let saleStatus = SaleStatus.load("sale")
    if (saleStatus == null) {
        saleStatus = new SaleStatus("sale")
        saleStatus.totalCapitalInvested = BigInt.fromI32(0)
        saleStatus.totalCapitalRaised = BigInt.fromI32(0)
        saleStatus.totalCapitalWithdrawn = BigInt.fromI32(0)
        saleStatus.totalTokensAllocated = BigInt.fromI32(0)
        saleStatus.isCanceled = false
        saleStatus.capitalWithdrawn = false
        saleStatus.hasEnded = false
        saleStatus.lastUpdated = BigInt.fromI32(0)
    }
    return saleStatus
}
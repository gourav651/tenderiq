import assert from "node:assert";
import { QueryTendersSchema, TenderIdParamSchema } from "../../src/modules/tender/tender.schema";
import { AIService } from "../../src/modules/ai/ai.service";

// Test 1: Tender Query Schema Validation
{
  const validQuery = {
    page: "1",
    limit: "10",
    search: "Solar",
    tenderType: "WORKS",
    status: "ACTIVE",
    minEstimatedValue: "5000000",
  };

  const result = QueryTendersSchema.safeParse(validQuery);
  assert.strictEqual(result.success, true, "Valid query string params should parse successfully");
  if (result.success) {
    assert.strictEqual(result.data.page, 1);
    assert.strictEqual(result.data.limit, 10);
    assert.strictEqual(result.data.tenderType, "WORKS");
    assert.strictEqual(result.data.minEstimatedValue, 5000000);
  }
}

{
  const invalidQuery = {
    tenderType: "INVALID_TYPE",
  };

  const result = QueryTendersSchema.safeParse(invalidQuery);
  assert.strictEqual(result.success, false, "Invalid tenderType should fail validation");
}

// Test 2: Tender ID Param Schema Validation
{
  const validUuid = "123e4567-e89b-12d3-a456-426614174000";
  const invalidUuid = "not-a-uuid-123";

  assert.strictEqual(TenderIdParamSchema.safeParse({ id: validUuid }).success, true);
  assert.strictEqual(TenderIdParamSchema.safeParse({ id: invalidUuid }).success, false);
}

// Test 3: AI Intent Natural Query Parsing Fallback
async function testAiIntentParsing() {
  const parsed = await AIService.parseSearchIntent("Solar farm construction in Rajasthan over 50 Lakhs");
  
  assert.strictEqual(parsed.state, "Rajasthan", "State should be extracted as Rajasthan");
  assert.strictEqual(parsed.tenderType, "WORKS", "Construction keyword should trigger WORKS type");
  assert.strictEqual(parsed.minEstimatedValue, 5000000, "50 Lakhs should equal 5,000,000 INR");
  
  console.log("✅ All Tender & AI unit tests passed successfully!");
}

testAiIntentParsing().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});

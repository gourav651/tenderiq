import assert from "node:assert";
import { CreateApplicationSchema } from "../../src/modules/application/application.schema";
import { AIService } from "../../src/modules/ai/ai.service";

// Test 1: Application Zod Validation
{
  const validApp = {
    tenderId: "123e4567-e89b-12d3-a456-426614174000",
    status: "SAVED",
    notes: "Reviewing eligibility criteria with management.",
  };

  const result = CreateApplicationSchema.safeParse(validApp);
  assert.strictEqual(result.success, true, "Valid application input should pass schema validation");
}

{
  const invalidApp = {
    tenderId: "invalid-uuid",
    status: "INVALID_STATUS",
  };

  const result = CreateApplicationSchema.safeParse(invalidApp);
  assert.strictEqual(result.success, false, "Invalid application data should fail validation");
}

// Test 2: AI Eligibility Evaluation Fallback Test
async function testEligibilityEvaluation() {
  const company = {
    name: "SolarTech Infrastructure Ltd",
    annualTurnover: 50000000,
    yearsOfExperience: 8,
    certifications: ["ISO 9001:2015"],
    areasOfOperation: ["Rajasthan", "Delhi"],
    industry: "Renewable Energy",
  };

  const tender = {
    title: "Supply & Installation of 500kW Solar Panels",
    category: "Renewable Energy",
    estimatedValue: 20000000,
    requirements: [
      { type: "FINANCIAL", title: "Turnover Threshold", description: "Minimum turnover of 1 Crore", isMandatory: true },
      { type: "EXPERIENCE", title: "Years of Experience", description: "At least 3 years experience", isMandatory: true },
    ],
  };

  const result = await AIService.analyzeEligibility(company, tender);

  assert.ok(["MATCH", "PARTIAL_MATCH", "INELIGIBLE"].includes(result.matchStatus), "Match status should be valid enum value");
  assert.ok(typeof result.matchScore === "number" && result.matchScore >= 0 && result.matchScore <= 100, "Match score should be between 0 and 100");
  assert.ok(Array.isArray(result.matchedCriteria), "Matched criteria should be an array");

  console.log("✅ All Application & AI Eligibility unit tests passed successfully!");
}

testEligibilityEvaluation().catch((err) => {
  console.error("❌ Eligibility Test failed:", err);
  process.exit(1);
});

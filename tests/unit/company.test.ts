import assert from "node:assert";
import { CreateCompanySchema, UpdateCompanySchema } from "../../src/modules/company/company.schema";
import { AuthService, ForbiddenError } from "../../src/modules/auth/auth.service";

// Test 1: Company Schema Validation
{
  const validData = {
    name: "SolarTech Industries",
    industry: "Renewable Energy",
    website: "https://solartech.example.com",
    annualTurnover: 50000000,
    yearsOfExperience: 8,
    certifications: ["ISO 9001"],
    areasOfOperation: ["Odisha", "West Bengal"],
  };

  const result = CreateCompanySchema.safeParse(validData);
  assert.strictEqual(result.success, true, "Valid company data should pass schema validation");
}

{
  const invalidData = {
    name: "A", // too short
    industry: "", // empty
    website: "not-a-url",
    annualTurnover: -100, // negative
  };

  const result = CreateCompanySchema.safeParse(invalidData);
  assert.strictEqual(result.success, false, "Invalid company data should fail schema validation");
}

// Test 2: IDOR / Company Ownership Verification Guard
{
  const userCompanyId = "company-123";
  const sameCompanyId = "company-123";
  const otherCompanyId = "company-999";

  // Should succeed without throwing
  assert.doesNotThrow(() => {
    AuthService.verifyCompanyAccess(userCompanyId, sameCompanyId);
  }, "Accessing same company resources should succeed");

  // Should throw ForbiddenError for different company
  assert.throws(
    () => {
      AuthService.verifyCompanyAccess(userCompanyId, otherCompanyId);
    },
    ForbiddenError,
    "Accessing another company resources must throw ForbiddenError"
  );
}

console.log("✅ All Auth & Company unit tests passed successfully!");

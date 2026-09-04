import assert from "node:assert";
import { AIService } from "../../src/modules/ai/ai.service";

async function testTenderQAEngine() {
  const tender = {
    title: "Construction of 4-Lane Highway Bypass",
    referenceNumber: "NHAI/2026/HW-09",
    category: "CIVIL",
    organization: "National Highways Authority of India",
    description: "Scope includes earthwork, bitumen paving, and bridge construction.",
    requirements: [
      {
        type: "FINANCIAL",
        title: "Minimum Turnover",
        description: "Contractor must have minimum annual turnover of 25 Crores in past 3 financial years.",
        isMandatory: true,
      },
      {
        type: "TECHNICAL",
        title: "Highway Completion Certificate",
        description: "Must have completed at least one 10km 4-lane highway project.",
        isMandatory: true,
      },
    ],
  };

  const response = await AIService.askTenderQuestion(tender, "What is the turnover requirement?");

  assert.ok(response.answer && response.answer.length > 0, "QA response should contain answer text");
  assert.ok(["HIGH", "MEDIUM", "LOW"].includes(response.confidence), "Confidence should be a valid level");

  console.log("✅ All Analytics & Tender Q&A unit tests passed successfully!");
}

testTenderQAEngine().catch((err) => {
  console.error("❌ Analytics/QA Test failed:", err);
  process.exit(1);
});

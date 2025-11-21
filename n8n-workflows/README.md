# PAM Contract Analyzer - n8n Workflow

This directory contains n8n workflow configurations for automating contract analysis and rule extraction in the PAM (Partner Agreement Management) AI Rule Engine.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Workflow Setup](#workflow-setup)
5. [Configuration](#configuration)
6. [Testing the Workflow](#testing-the-workflow)
7. [Integration with PAM](#integration-with-pam)
8. [Troubleshooting](#troubleshooting)
9. [Advanced Usage](#advanced-usage)

---

## 🎯 Overview

### What This Workflow Does

The **PAM Contract Analyzer** workflow automates the extraction of revenue sharing rules from contract PDFs using AI. It:

1. **Receives PDF contracts** via webhook
2. **Extracts text** from the PDF document
3. **Analyzes content** using OpenAI GPT-4o-mini
4. **Identifies revenue rules** specifically for OneFootball Partner (Text & Video)
5. **Converts to tokens** compatible with PAM's visual rule editor
6. **Stores results** as JSON files
7. **Returns structured data** to the caller

### Workflow Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Webhook   │───▶│  PDF Parser  │───▶│  AI Agent   │
│  (Upload)   │    │  (Extract)   │    │  (Analyze)  │
└─────────────┘    └──────────────┘    └─────────────┘
                                              │
                                              ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  Response   │◀───│  File Save   │◀───│   Format    │
│  (Return)   │    │  (Storage)   │    │ (Structure) │
└─────────────┘    └──────────────┘    └─────────────┘
```

---

## 📦 Prerequisites

### Required Software

1. **n8n** (v1.0.0 or higher)
   - Self-hosted or n8n Cloud
   - [Installation Guide](https://docs.n8n.io/hosting/)

2. **OpenAI API Key**
   - Sign up at [OpenAI Platform](https://platform.openai.com/)
   - Generate API key from [API Keys page](https://platform.openai.com/api-keys)
   - Requires access to GPT-4o-mini model

3. **Node.js** (v18.10.0 or higher)
   - Required if self-hosting n8n

### Optional

- **Docker** (for containerized n8n deployment)
- **PostgreSQL** (for production n8n deployments)

---

## 🚀 Installation

### Option 1: Self-Hosted n8n (NPM)

```bash
# Install n8n globally
npm install -g n8n

# Start n8n
n8n start

# n8n will be available at http://localhost:5678
```

### Option 2: Self-Hosted n8n (Docker)

```bash
# Pull the n8n Docker image
docker pull n8nio/n8n

# Run n8n container
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Access n8n at http://localhost:5678
```

### Option 3: n8n Cloud

1. Sign up at [n8n.cloud](https://n8n.cloud)
2. Create a new workspace
3. Access your cloud instance

---

## ⚙️ Workflow Setup

### Step 1: Access n8n Interface

1. Open your n8n instance (e.g., `http://localhost:5678`)
2. Log in or create an account
3. Navigate to **Workflows** section

### Step 2: Import the Workflow

#### Method A: Import from File

1. Click **"+ Create New Workflow"** or **"Import from File"**
2. Select the file: `pam-contract-analyzer.json`
3. Click **"Import"**

#### Method B: Manual Import

1. Open `pam-contract-analyzer.json` in a text editor
2. Copy the entire JSON content
3. In n8n, click **"Import from URL or File"**
4. Paste the JSON content
5. Click **"Import"**

### Step 3: Verify Workflow Structure

After import, you should see these nodes:

- **Webhook - Contract Upload** (trigger)
- **Code - Extract PDF Text** (PDF processing)
- **AI Agent - Rule Extractor** (OpenAI analysis)
- **OpenAI Chat Model** (AI model configuration)
- **Code - Format Response** (data structuring)
- **Save Rules to Filesystem** (storage)
- **Respond to Webhook** (response)
- **4 Sticky Notes** (documentation)

---

## 🔧 Configuration

### 1. Configure OpenAI Credentials

#### Create OpenAI Credential in n8n

1. Click on the **"OpenAI Chat Model"** node
2. Click **"Select Credential"** dropdown
3. Click **"+ Create New Credential"**
4. Enter your OpenAI API Key
5. Test the connection
6. Save the credential

#### Update Credential ID

In the workflow JSON, update this section:

```json
{
  "credentials": {
    "openAiApi": {
      "id": "YOUR_OPENAI_CREDENTIAL_ID",
      "name": "OpenAI Account"
    }
  }
}
```

Replace `YOUR_OPENAI_CREDENTIAL_ID` with your actual credential ID from n8n.

### 2. Configure File Storage Path

In the **"Save Rules to Filesystem"** node:

1. Click on the node
2. Update the `fileName` parameter:
   ```
   {{ $json.contract_id }}/original.json
   ```
3. Ensure the base path points to your PAM project's `contract-rules` directory

**For PAM Integration:**

If you want files saved directly to your PAM project, modify the path:

```
/path/to/PAM-AI-Rule-Engine/contract-rules/{{ $json.contract_id }}/original.json
```

### 3. Configure Webhook Settings

The webhook is configured with path: `pam-contract-upload`

**Production URL Structure:**
- Self-hosted: `http://localhost:5678/webhook/pam-contract-upload`
- n8n Cloud: `https://your-instance.app.n8n.cloud/webhook/pam-contract-upload`

**Security Options:**

For production, consider:
- Adding authentication headers
- Using HTTPS
- Implementing rate limiting
- Adding IP whitelist

To add authentication:

1. Click the **"Webhook - Contract Upload"** node
2. Go to **"Options"**
3. Add **"Response Headers"** or **"Authentication"**

### 4. Configure PDF Text Extraction

The **"Code - Extract PDF Text"** node contains placeholder code. For production, you have two options:

#### Option A: Use n8n's Extract from File Node

Replace the Code node with:
1. **"Extract from File"** node (n8n community node)
2. Configure it to extract text from PDFs

#### Option B: Integrate with External PDF Service

Modify the code to call an external PDF parsing service:

```javascript
// Example: Using an external PDF API
const pdfResponse = await fetch('https://pdf-api.example.com/parse', {
  method: 'POST',
  body: binaryData,
  headers: { 'Content-Type': 'application/pdf' }
});

const pdfText = await pdfResponse.text();
```

---

## 🧪 Testing the Workflow

### Step 1: Activate the Workflow

1. Click the **toggle switch** at the top right to activate
2. Status should change to **"Active"**
3. The webhook URL will be generated

### Step 2: Get Your Webhook URL

1. Click on the **"Webhook - Contract Upload"** node
2. Copy the **"Production URL"** or **"Test URL"**
3. Example: `http://localhost:5678/webhook/pam-contract-upload`

### Step 3: Test with cURL

#### Basic Test

```bash
curl -X POST \
  http://localhost:5678/webhook/pam-contract-upload \
  -F "contract_pdf=@/path/to/your/contract.pdf"
```

#### Test with Sample Contract

Using a contract from your PAM project:

```bash
cd /Users/suryaethalapaka/Desktop/PAM/PAM-AI-Rule-Engine
curl -X POST \
  http://localhost:5678/webhook/pam-contract-upload \
  -F "contract_pdf=@reference/sample/Contract.PDF"
```

#### Expected Response

```json
{
  "success": true,
  "contract_id": "1234567890",
  "timestamp": "2025-11-21T10:30:00.000Z",
  "rules": {
    "docType": "contract",
    "summary": "Found Exhibit D with OneFootball Partner revenue sharing rules...",
    "searchResults": {
      "exhibitDFound": true,
      "tablesFound": 2,
      "revenueTermsFound": ["Content Type", "Revenue Share", "Cost of Sales"]
    },
    "rules": [
      {
        "id": "rule_1",
        "name": "OneFootBall text",
        "source": "Exhibit D",
        "tokens": [...]
      },
      {
        "id": "rule_2",
        "name": "OneFootBall Video",
        "source": "Exhibit D",
        "tokens": [...]
      }
    ]
  },
  "metadata": {
    "doc_type": "contract",
    "exhibit_d_found": true,
    "tables_found": 2,
    "rules_extracted": 2
  }
}
```

### Step 4: Test with Postman

1. Open Postman
2. Create a new **POST** request
3. Set URL: `http://localhost:5678/webhook/pam-contract-upload`
4. Go to **Body** tab
5. Select **form-data**
6. Add key: `contract_pdf` (type: File)
7. Upload a PDF file
8. Click **Send**

### Step 5: Monitor Execution

1. Go to **Executions** in n8n
2. View the workflow execution log
3. Check each node's output
4. Verify AI responses and extracted rules

---

## 🔗 Integration with PAM

### Option 1: Replace PAM's API Route

Modify your PAM project to call the n8n webhook instead of processing locally.

#### Update `/app/api/contracts/analyze/route.ts`

```typescript
export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get("contract") as File;
    const contractId = data.get("contractId") as string;

    // Send to n8n workflow
    const formData = new FormData();
    formData.append("contract_pdf", file);

    const n8nResponse = await fetch(
      "http://localhost:5678/webhook/pam-contract-upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await n8nResponse.json();

    return NextResponse.json({
      success: true,
      contractId,
      rules: result.rules,
      metadata: result.metadata,
    });
  } catch (error: any) {
    console.error("❌ n8n workflow failed:", error);
    return NextResponse.json(
      { error: "Contract analysis failed", details: error.message },
      { status: 500 }
    );
  }
}
```

### Option 2: Hybrid Approach

Keep PAM's existing logic as a fallback, but try n8n first:

```typescript
export async function POST(request: NextRequest) {
  try {
    // Try n8n workflow first
    try {
      const n8nResponse = await fetch(
        "http://localhost:5678/webhook/pam-contract-upload",
        {
          method: "POST",
          body: formData,
          timeout: 30000, // 30 second timeout
        }
      );

      if (n8nResponse.ok) {
        const result = await n8nResponse.json();
        return NextResponse.json(result);
      }
    } catch (n8nError) {
      console.warn("n8n workflow unavailable, using fallback");
    }

    // Fallback to original PAM logic
    const extract = await extractRules(pdfData.text);
    // ... rest of original code
  } catch (error: any) {
    // Error handling
  }
}
```

### Option 3: Parallel Processing

Process contracts through both n8n and PAM, compare results:

```typescript
// Process through both systems
const [n8nResult, pamResult] = await Promise.allSettled([
  processViaN8n(file),
  processViaPAM(pdfData.text),
]);

// Use n8n result if successful, fallback to PAM
const finalResult = n8nResult.status === "fulfilled" 
  ? n8nResult.value 
  : pamResult.value;
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Webhook Not Accessible

**Problem:** Can't reach webhook URL

**Solutions:**
- Ensure n8n is running: `docker ps` or check service status
- Check firewall rules
- Verify the workflow is **Active** (toggle switch)
- Test with localhost first before external URLs

#### 2. OpenAI API Errors

**Problem:** "Invalid API key" or "Rate limit exceeded"

**Solutions:**
- Verify API key in n8n credentials
- Check OpenAI account has credits
- Ensure you have access to gpt-4o-mini model
- Check rate limits on your OpenAI account

#### 3. PDF Parsing Fails

**Problem:** Can't extract text from PDF

**Solutions:**
- Ensure PDF is not password-protected
- Check PDF is not scanned images (requires OCR)
- Verify file upload size limits in n8n
- Use a dedicated PDF parsing service for complex PDFs

#### 4. File Storage Errors

**Problem:** Can't save to filesystem

**Solutions:**
- Check file permissions on target directory
- Verify the path exists or enable auto-creation
- Ensure n8n has write access to the directory
- For Docker, check volume mounts

#### 5. No Rules Extracted

**Problem:** AI returns empty rules array

**Solutions:**
- Check if contract contains "Exhibit D"
- Verify contract has revenue sharing tables
- Review AI prompt in the Agent node
- Check OpenAI response in execution log
- Contract might not match expected format

### Debug Mode

Enable detailed logging:

1. Go to **Settings** → **Workflow Settings**
2. Enable **"Save Execution Data"**
3. Set **"Save Manual Executions"** to Yes
4. Check execution logs after each run

### Check n8n Logs

#### NPM Installation
```bash
# n8n logs are in console output
n8n start --verbose
```

#### Docker Installation
```bash
# View container logs
docker logs n8n

# Follow logs in real-time
docker logs -f n8n
```

---

## 🚀 Advanced Usage

### 1. Adding Email Notifications

After rule extraction, send results via email:

1. Add **"Send Email"** node after Format Response
2. Configure SMTP credentials
3. Create email template with results

```
New Contract Analyzed!

Contract ID: {{ $json.contract_id }}
Rules Extracted: {{ $json.metadata.rules_extracted }}
Exhibit D Found: {{ $json.metadata.exhibit_d_found }}

Summary:
{{ $json.rules.summary }}
```

### 2. Database Storage

Store results in PostgreSQL or MongoDB:

1. Add database node after Format Response
2. Configure connection credentials
3. Insert contract data and rules

Example PostgreSQL query:
```sql
INSERT INTO contracts (id, rules, metadata, created_at)
VALUES (
  '{{ $json.contract_id }}',
  '{{ JSON.stringify($json.rules) }}',
  '{{ JSON.stringify($json.metadata) }}',
  NOW()
)
```

### 3. Slack Integration

Send notifications to Slack channel:

1. Add **"Slack"** node
2. Configure Slack credentials
3. Post message with extraction summary

### 4. Multi-Model Comparison

Compare results from different AI models:

1. Duplicate the AI Agent node
2. Configure one with GPT-4o-mini, another with GPT-4
3. Add comparison logic to choose best result

### 5. Batch Processing

Process multiple contracts:

1. Add **"Split In Batches"** node at the start
2. Configure batch size (e.g., 5 contracts)
3. Add **"Loop Over Items"** logic
4. Aggregate results at the end

### 6. Custom Webhook Authentication

Add API key authentication:

```javascript
// In Webhook node's "Options" → "Add Property" → "Response Code"
// Add custom authentication check

const apiKey = $request.headers['x-api-key'];
const validKey = 'your-secret-api-key';

if (apiKey !== validKey) {
  $respond.status(401).json({ error: 'Unauthorized' });
  return;
}

// Continue with normal processing
```

### 7. Performance Monitoring

Add execution time tracking:

```javascript
// Add at start of workflow
const startTime = Date.now();

// Add at end of workflow
const endTime = Date.now();
const executionTime = endTime - startTime;

return {
  ...results,
  performance: {
    execution_time_ms: executionTime,
    timestamp: new Date().toISOString()
  }
};
```

---

## 📚 Additional Resources

### n8n Documentation
- [Official Docs](https://docs.n8n.io/)
- [Workflow Templates](https://n8n.io/workflows)
- [Community Forum](https://community.n8n.io/)

### OpenAI Resources
- [API Documentation](https://platform.openai.com/docs)
- [Model Pricing](https://openai.com/pricing)
- [Best Practices](https://platform.openai.com/docs/guides/production-best-practices)

### PAM Project
- Main README: `../README.md`
- API Routes: `../app/api/`
- OpenAI Service: `../lib/openai-service.ts`

---

## 🤝 Support

### Getting Help

1. **Check this README** for common issues
2. **Review n8n execution logs** for errors
3. **Check OpenAI API status** at [status.openai.com](https://status.openai.com)
4. **n8n Community Forum** for workflow questions
5. **PAM Project Issues** for integration questions

### Reporting Issues

When reporting issues, include:
- n8n version
- Workflow execution ID
- Error messages from logs
- Sample contract (if possible)
- Expected vs. actual behavior

---

## 📄 License

This workflow configuration is part of the PAM AI Rule Engine project.

---

## 🎉 Conclusion

You now have a fully automated contract analysis workflow! The system will:

✅ Receive PDF contracts via webhook  
✅ Extract and analyze contract text  
✅ Identify revenue sharing rules using AI  
✅ Convert rules to token-based format  
✅ Store results for PAM integration  
✅ Return structured JSON responses  

**Next Steps:**

1. Test the workflow with sample contracts
2. Integrate with your PAM application
3. Monitor performance and adjust as needed
4. Explore advanced features like notifications and batch processing

Happy automating! 🚀


# Resources Capture

Simple web form for capturing resources to Notion.

## Deployment

1. **Import to Vercel:**
   - Go to https://vercel.com/new
   - Import from GitHub: `tmnguyenwo-code/resources-capture`

2. **Set Environment Variable:**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add:
     - Name: `NOTION_API_KEY`
     - Value: Your Notion API key (starts with `ntn_`)

3. **Deploy:**
   - Click "Deploy"

## Usage

Visit the deployed URL and:
- Paste a link only: `https://example.com`
- Paste a link with text: `https://example.com check this out`
- Paste text only: `just some notes`

The form automatically extracts URLs and creates Notion entries with:
- Name: "TBD by Sentry N" (auto-incrementing)
- Link: extracted URL (if any)
- Text: remaining text (if any)
- Status: "Research"

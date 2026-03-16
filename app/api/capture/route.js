import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

const DATABASE_ID = '325afd1a-2519-818f-972e-dfc85371ca60'

// URL regex pattern
const URL_REGEX = /https?:\/\/[^\s]+/gi

export async function POST(request) {
  try {
    const { text } = await request.json()

    if (!text || !text.trim()) {
      return Response.json({ error: 'No text provided' }, { status: 400 })
    }

    // Extract URL and remaining text
    const urls = text.match(URL_REGEX) || []
    const url = urls[0] || null
    const remainingText = url ? text.replace(url, '').trim() : text.trim()

    // Query Notion to find the next available number
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: 'Name',
        rich_text: {
          starts_with: 'TBD by Sentry ',
        },
      },
      sorts: [
        {
          property: 'Name',
          direction: 'descending',
        },
      ],
      page_size: 1,
    })

    let nextNumber = 1
    if (response.results.length > 0) {
      const latestName = response.results[0].properties.Name.title[0]?.plain_text || ''
      const match = latestName.match(/TBD by Sentry (\d+)/)
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1
      }
    }

    const name = `TBD by Sentry ${nextNumber}`

    // Build properties object
    const properties = {
      Name: {
        title: [
          {
            text: {
              content: name,
            },
          },
        ],
      },
      Status: {
        select: {
          name: 'Research',
        },
      },
    }

    // Add Link if URL exists
    if (url) {
      properties.Link = {
        url: url,
      }
    }

    // Add Text if there's remaining text
    if (remainingText) {
      properties.Text = {
        rich_text: [
          {
            text: {
              content: remainingText,
            },
          },
        ],
      }
    }

    // Create the Notion page
    await notion.pages.create({
      parent: {
        database_id: DATABASE_ID,
      },
      properties: properties,
    })

    return Response.json({ success: true, name, url, text: remainingText })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

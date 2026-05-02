import fs from 'node:fs/promises';
import path from 'node:path';

// Using fetch to interact with GitHub REST API
async function fetchRecentCommits(actor: string, token: string) {
  // We'll fetch events for the user to find recent pushes across all repos
  const response = await fetch(`https://api.github.com/users/${actor}/events`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Astro-DevLog-Generator'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub events: ${response.statusText}`);
  }

  const events = await response.json();
  const pushEvents = events.filter((e: any) => e.type === 'PushEvent');

  // Filter for the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentPushes = pushEvents.filter((e: any) => new Date(e.created_at) > sevenDaysAgo);

  const commits = [];
  for (const event of recentPushes) {
    const repoName = event.repo.name;
    for (const commit of event.payload.commits) {
      commits.push(`Repo: ${repoName} | Commit: ${commit.message} | SHA: ${commit.sha.substring(0, 7)}`);
    }
  }

  return commits;
}

async function generateDevLogContent(commits: string[], geminiApiKey: string) {
  const prompt = `You are an expert technical writer and "Architect-Dad" developer managing multiple projects.

Your task is to generate a new Dev Log entry for a personal portfolio built in Astro.

Here are my recent GitHub commits from the last 7 days across all my active repositories:
${commits.length > 0 ? commits.join('\n') : "No significant commits found. Write about ongoing architectural planning and code review."}

Synthesize these commits into a concise, narrative-driven Dev Log. Do not just list commits; explain *what* architectural decisions were made, *why* bugs occurred, and *how* features were shipped etc.
Match the "Architect-Dad" brand voice: authoritative, minimalist, focused on shipping velocity and zero-BS engineering.
Format the output as an MDX file. Use the following frontmatter schema:

---
title: "[Catchy, minimalist title summarizing the main effort]"
description: "[1-2 sentence summary of the updates]"
pubDate: ${new Date().toISOString().split('T')[0]}T12:00:00Z
tags: ["[Relevant Tag 1]", "[Relevant Tag 2]"]
---

[Body of the dev log using clean markdown, bullet points for specific updates, and short paragraphs.]`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  };

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`Failed to generate content: ${response.statusText}`);
  }

  const data = await response.json();
  let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Clean up any markdown code block wrappers
  text = text.replace(/^```(md|mdx|markdown)?\n/, '').replace(/\n```$/, '');
  return text;
}

async function main() {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const githubActor = process.env.GITHUB_ACTOR || 'google-labs-jules'; // fallback

    if (!githubToken || !geminiApiKey) {
      console.error('Missing required environment variables: GITHUB_TOKEN or GEMINI_API_KEY');
      process.exit(1);
    }

    console.log('Fetching recent commits...');
    const commits = await fetchRecentCommits(githubActor, githubToken);

    console.log(`Found ${commits.length} commits. Generating Dev Log...`);
    const devLogContent = await generateDevLogContent(commits, geminiApiKey);

    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `automated-devlog-${dateStr}.mdx`;
    const filepath = path.join(process.cwd(), 'src', 'data', 'devlog', filename);

    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, devLogContent, 'utf-8');

    console.log(`Successfully generated Dev Log: ${filepath}`);
  } catch (error) {
    console.error('Error generating Dev Log:', error);
    process.exit(1);
  }
}

main();

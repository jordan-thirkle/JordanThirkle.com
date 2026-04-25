import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { getCollection } from 'astro:content';
import fs from 'fs';
import path from 'path';

export async function getStaticPaths() {
  const blogs = await getCollection('blog');
  const projects = await getCollection('projects');
  
  const entries = [
    ...blogs.map(post => ({
      params: { slug: `blog/${post.id}` },
      props: { title: post.data.title, description: post.data.description },
    })),
    ...projects.map(proj => ({
      params: { slug: `projects/${proj.id}` },
      props: { title: proj.data.title, description: proj.data.description },
    })),
    {
      params: { slug: 'index' },
      props: { title: 'Jordan Thirkle', description: 'Full-Stack Architect & Product Engineer' },
    }
  ];

  return entries;
}

export const GET = async ({ props }) => {
  const { title, description } = props;

  // Load font from local file system
  const fontPath = path.join(process.cwd(), 'public/fonts/inter.ttf');
  const fontData = fs.readFileSync(fontPath);

  const svg = await satori(
    {
      type: 'div',
      props: {
        children: [
          {
            type: 'div',
            props: {
              children: 'JT',
              style: {
                fontSize: 40,
                fontWeight: 'bold',
                color: '#fff',
                background: '#000',
                padding: '10px 20px',
                borderRadius: 10,
                marginBottom: 20,
              },
            },
          },
          {
            type: 'h1',
            props: {
              children: title,
              style: {
                fontSize: 70,
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: 20,
                lineHeight: 1.1,
              },
            },
          },
          {
            type: 'p',
            props: {
              children: description,
              style: {
                fontSize: 30,
                color: '#a1a1aa',
                lineHeight: 1.4,
              },
            },
          },
        ],
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#09090b',
          padding: '80px',
        },
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );

  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
};

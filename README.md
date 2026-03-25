This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contact Form Email Setup (EmailJS)

The contact form sends messages via EmailJS from the browser using `@emailjs/browser`.

1. Create an EmailJS account and add an email service.
2. Create an email template and include these variables in the template body:
	- `{{from_name}}`
	- `{{from_email}}`
	- `{{message}}`
	- `{{to_email}}`
	- `{{reply_to}}`
3. Add a `.env.local` file in the project root with:

```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
NEXT_PUBLIC_CONTACT_RECEIVER_EMAIL=your_email@example.com
```

4. Restart the dev server after adding environment variables.
5. Do not call EmailJS from a Next.js route handler unless you explicitly enable non-browser API access in your EmailJS account security settings.

## Registration Setup (MongoDB)

The registration modal now submits to `POST /api/register` and saves data to MongoDB.

1. Create or use a MongoDB database (MongoDB Atlas or local MongoDB).
2. Add these variables to `.env.local`:

```bash
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=breakthrough
```

3. Restart the dev server after updating environment variables.

Saved records are inserted into the `registrations` collection.

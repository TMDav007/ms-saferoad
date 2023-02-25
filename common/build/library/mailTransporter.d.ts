declare const mailTransporter: ({ to, subject, text, html, }: {
    to: string;
    subject: string;
    text?: string | undefined;
    html?: any;
}) => Promise<void>;
export default mailTransporter;

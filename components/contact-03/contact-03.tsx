import { MailIcon, MapPinIcon, MessageCircle, PhoneIcon } from "lucide-react";
import Link from "next/link";
import { BasicBackgroundPattern } from "@/components/ui/background-patterns/basic-background";

const cardStyle =
  "relative bg-transparent p-6 pb-10 border-2 border-primary/5 rounded-lg shadow-lg shadow-primary/5";

const cardBackgroundStyle="absolute inset-0 -z-10";

const Contact03Page = () => (
  <div className="min-h-screen flex items-center justify-center pt-12 md:pt-16 pb-16">
    <div className="w-full max-w-screen-xl mx-auto px-6 xl:px-0">
      <b className="text-muted-foreground">Contact Us</b>
      <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
        We&apos;d love to hear from you
      </h2>
      <p className="mt-4 text-base sm:text-lg">
        Our friendly team is always here to chat.
      </p>
      <div className="mt-14 md:mt-24 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* Mail */}
        <div className={cardStyle}>
          <div className={cardBackgroundStyle}>
            <BasicBackgroundPattern />
          </div>
          <div className="h-12 w-12 flex items-center justify-center bg-primary/10 text-primary rounded-full">
            <MailIcon />
          </div>
          <h3 className="mt-8 font-bold text-xl">Email</h3>
          <p className="mt-2.5 mb-4 text-muted-foreground">
            Our friendly team is here to help.
          </p>
          <Link
            className="font-medium"
            href="mailto:akashmoradiya3444@gmail.com"
          >
            akashmoradiya3444@gmail.com
          </Link>
        </div>
        {/* Chat with us */}
        <div className={cardStyle}>
          <div className={cardBackgroundStyle} >
            <BasicBackgroundPattern />
          </div>
          <div className="h-12 w-12 flex items-center justify-center bg-primary/10 text-primary rounded-full">
            <MessageCircle />
          </div>
          <h3 className="mt-8 font-bold text-xl">Live chat</h3>
          <p className="mt-2.5 mb-4 text-muted-foreground">
            Our friendly team is here to help.
          </p>
          <Link className="font-medium" href="#">
            Start new chat
          </Link>
        </div>
        {/* Office */}
        <div className={cardStyle}>
          <div className={cardBackgroundStyle}>
            <BasicBackgroundPattern />
          </div>
          <div className="h-12 w-12 flex items-center justify-center bg-primary/10 text-primary rounded-full">
            <MapPinIcon />
          </div>
          <h3 className="mt-8 font-bold text-xl">Office</h3>
          <p className="mt-2.5 mb-4 text-muted-foreground">
            Come say hello at our office HQ.
          </p>
          <Link
            className="font-medium"
            href="https://map.google.com"
            target="_blank"
          >
            100 Smith Street Collingwood <br /> VIC 3066 AU
          </Link>
        </div>
        <div className={cardStyle}>
          <div className={cardBackgroundStyle}>
            <BasicBackgroundPattern />
          </div>
          <div className="h-12 w-12 flex items-center justify-center bg-primary/10 text-primary rounded-full">
            <PhoneIcon />
          </div>
          <h3 className="mt-8 font-bold text-xl">Phone</h3>
          <p className="mt-2.5 mb-4 text-muted-foreground">
            Mon-Fri from 8am to 5pm.
          </p>
          <Link className="font-medium" href="tel:akashmoradiya3444@gmail.com">
            +1 (555) 000-0000
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default Contact03Page;

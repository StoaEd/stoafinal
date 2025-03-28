import { Button } from "@/components/ui/button";
import { DribbbleIcon, TwitchIcon, TwitterIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BasicBackgroundPattern } from "@/components/ui/background-patterns/basic-background";

const teamMembers = [
  {
    name: "John Doe",
    title: "Founder & CEO",
    bio: "Former co-founder of Opendoor. Early staff at Spotify and Clearbit.",
    imageUrl: "/team-pics/person1m.jpeg",
  },
  {
    name: "Jane Doe",
    title: "Engineering Manager",
    bio: "Lead engineering teams at Figma, Pitch, and Protocol Labs.",
    imageUrl: "/team-pics/person2f.jpeg",
  },
  {
    name: "Bob Smith",
    title: "Product Manager",
    bio: "Former PM for Linear, Lambda School, and On Deck.",
    imageUrl: "/team-pics/person3m.jpeg",
  },
  {
    name: "Peter Johnson",
    title: "Frontend Developer",
    bio: "Former frontend dev for Linear, Coinbase, and Postscript.",
    imageUrl: "/team-pics/person4m.jpeg",
  },
  {
    name: "David Lee",
    title: "Backend Developer",
    bio: "Lead backend dev at Clearbit. Former Clearbit and Loom.",
    imageUrl: "/team-pics/person5m.jpeg",
  },
  {
    name: "Sarah Williams",
    title: "Product Designer",
    bio: "Founding design team at Figma. Former Pleo, Stripe, and Tile.",
    imageUrl: "/team-pics/person6f.jpeg",
  },
  {
    name: "Michael Brown",
    title: "UX Researcher",
    bio: "Lead user research for Slack. Contractor for Netflix and Udacity.",
    imageUrl: "/team-pics/person7m.jpeg",
  },
  {
    name: "Elizabeth Johnson",
    title: "Customer Success",
    bio: "Lead CX at Wealthsimple. Former PagerDuty and Sqreen.",
    imageUrl: "/team-pics/person8f.jpeg",
  },
];

const Team04Page = () => {
  return (
    <div className="flex flex-col justify-center py-8 sm:py-16 px-6 lg:px-8 max-w-screen-xl mx-auto gap-16">
      <div className="text-center max-w-2xl mx-auto">
        <b className="text-center text-muted-foreground text-base font-semibold">
          We&apos;re hiring!
        </b>
        <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
          Meet Our Team
        </h2>
        <p className="mt-6 text-base sm:text-lg">
          Our philosophy is simple — hire a team of diverse, passionate people
          and foster a culture that empowers you to do you best work.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row-reverse sm:justify-center gap-3">
          <Button size="lg">Open Positions</Button>
          <Button size="lg" variant="outline">
            About Us
          </Button>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-12">
        {teamMembers.map((member) => (
          <div key={member.name} className="relative w-full min-h-[400px] border-2 border-primary/5 rounded-lg shadow-lg shadow-primary/5">
            <div className="absolute inset-0">
              <BasicBackgroundPattern />
            </div>
            <div className="relative flex flex-col h-full z-10 items-center text-center  py-8 px-6 ">
              <Image
                src={member.imageUrl}
                alt={member.name}
                className="shrink-0 h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover bg-accent"
                width={120}
                height={120}
              />
              <h3 className="mt-5 text-lg font-semibold">{member.name}</h3>
              <p className="text-muted-foreground text-sm">{member.title}</p>
              <p className="mt-2 mb-6">{member.bio}</p>
              <div className="mt-auto flex items-center gap-4">
                <Link href="#" target="_blank">
                  <TwitterIcon className="stroke-muted-foreground h-5 w-5" />
                </Link>
                <Link href="#" target="_blank">
                  <DribbbleIcon className="stroke-muted-foreground h-5 w-5" />
                </Link>
                <Link href="#" target="_blank">
                  <TwitchIcon className="stroke-muted-foreground h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team04Page;

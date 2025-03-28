/* eslint-disable */

import Image from "next/image"

export const Icons = {
  logo: function LogoIcon({ className, ...props }: React.ComponentProps<"div">) {
    return (
      <div className={className}>
        <Image
          src="/vercel.svg"
          alt="Vercel Logo"
          width={24}
          height={24}
          priority
        />
      </div>
    )
  }
}
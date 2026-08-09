"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: [
            "group toast",
            "group-[.toaster]:bg-card group-[.toaster]:text-foreground",
            "group-[.toaster]:border group-[.toaster]:border-border",
            "group-[.toaster]:border-l-4 group-[.toaster]:border-l-border",
            "group-[.toaster]:rounded-xl group-[.toaster]:px-4 group-[.toaster]:py-3.5",
            "group-[.toaster]:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]",
            "data-[type=success]:group-[.toaster]:border-l-success",
            "data-[type=error]:group-[.toaster]:border-l-error",
            "data-[type=warning]:group-[.toaster]:border-l-warning",
            "data-[type=info]:group-[.toaster]:border-l-info",
            "data-[type=success]:group-[.toaster]:[&_[data-icon]>svg]:text-success",
            "data-[type=error]:group-[.toaster]:[&_[data-icon]>svg]:text-error",
            "data-[type=warning]:group-[.toaster]:[&_[data-icon]>svg]:text-warning",
            "data-[type=info]:group-[.toaster]:[&_[data-icon]>svg]:text-info",
            "data-[type=success]:group-[.toaster]:[&_[data-title]]:text-success",
            "data-[type=error]:group-[.toaster]:[&_[data-title]]:text-error",
          ].join(" "),
          title: "group-[.toast]:font-semibold group-[.toast]:text-foreground group-[.toast]:text-sm",
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:text-sm group-[.toast]:leading-relaxed",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-md group-[.toast]:font-semibold group-[.toast]:text-xs group-[.toast]:px-3 group-[.toast]:h-8 group-[.toast]:hover:bg-primary/90",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-md group-[.toast]:font-medium group-[.toast]:text-xs group-[.toast]:px-3 group-[.toast]:h-8 group-[.toast]:hover:bg-muted/80",
          closeButton:
            "group-[.toast]:bg-card group-[.toast]:text-muted-foreground group-[.toast]:border-border group-[.toast]:rounded-full group-[.toast]:hover:bg-muted group-[.toast]:hover:text-foreground",
          icon: "group-[.toast]:shrink-0",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

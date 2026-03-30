import { StaffLayout } from "@/components/staff/StaffLayout";

export default function StaffSegmentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StaffLayout>{children}</StaffLayout>;
}

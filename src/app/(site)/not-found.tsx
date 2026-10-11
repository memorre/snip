import { NotFoundContent } from "@/components/not-found-content";

// notFound() from a screen inside the group (e.g. analytics for a link you don't own) keeps the
// group's shell mounted.
export default function NotFound() {
  return <NotFoundContent />;
}

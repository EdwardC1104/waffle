import Feed from "@/components/feed/Feed";
import { AuthenticatedRoute } from "@/components/general/AuthenticatedRoute";

export default function FollowingPage() {
  return (
    <AuthenticatedRoute>
      <Feed feedType="following" />
    </AuthenticatedRoute>
  );
}

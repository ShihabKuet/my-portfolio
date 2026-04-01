import { NextResponse } from "next/server";

const LEETCODE_API = "https://leetcode.com/graphql";

const query = `
  query getUserStats($username: String!) {
    matchedUser(username: $username) {
      username
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
      profile {
        ranking
        reputation
        starRating
      }
    }
  }
`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  try {
    const response = await fetch(LEETCODE_API, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ query, variables: { username } }),
      // Cache for 1 hour — no need to hit LeetCode on every page load
      next: { revalidate: 3600 },
    });

    const data = await response.json();

    if (!data?.data?.matchedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user   = data.data.matchedUser;
    const stats  = user.submitStatsGlobal.acSubmissionNum;

    // Parse the difficulty breakdown
    const all    = stats.find((s: { difficulty: string }) => s.difficulty === "All")?.count    ?? 0;
    const easy   = stats.find((s: { difficulty: string }) => s.difficulty === "Easy")?.count   ?? 0;
    const medium = stats.find((s: { difficulty: string }) => s.difficulty === "Medium")?.count ?? 0;
    const hard   = stats.find((s: { difficulty: string }) => s.difficulty === "Hard")?.count   ?? 0;

    return NextResponse.json({
      username,
      solved:  all,
      easy,
      medium,
      hard,
      ranking: user.profile.ranking,
    });

  } catch (error) {
    console.error("LeetCode API error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
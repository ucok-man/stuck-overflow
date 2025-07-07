import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

// import AnswersTab from "@/components/shared/AnswersTab";
// import QuestionTab from "@/components/shared/QuestionTab";
// import Stats from "@/components/shared/Stats";
import RenderTag from "@/components/render-tag";
import { api } from "@/trpc/server";
import { format } from "date-fns";
import AnswerTab from "./answer-tab";
import ProfileStats from "./profile-stats";
import QuestionTab from "./question-tab";

type Props = {
  params: Promise<{ clerkId: string }>;
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function ViewProfilePage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const profile = await api.user.getProfile({ clerkId: params.clerkId });
  const toptags = await api.user.getTopTag({
    clerkId: params.clerkId,
    take: 5,
  });

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={profile.user.picture}
            alt="profile picture"
            width={140}
            height={140}
            className="rounded-full object-cover"
          />

          <div className="mt-3">
            <h2 className="font-h2-bold text-dark-100_light-900">
              {profile.user.name}
            </h2>
            <p className="font-paragraph-regular text-dark-200_light-800">
              @{profile.user.username}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {profile.user.portfolioWebsite && (
                <div className="flex-center gap-1">
                  <Image
                    src={"/assets/icons/link.svg"}
                    alt="Icon Link"
                    width={20}
                    height={20}
                  />
                  <Link
                    href={profile.user.portfolioWebsite}
                    target="_blank"
                    className="paragraph-medium text-blue-500"
                  >
                    Portfolio
                  </Link>
                </div>
              )}

              {profile.user.location && (
                <div className="flex-center gap-1">
                  <Image
                    src={"/assets/icons/location.svg"}
                    alt="Icon Link"
                    width={20}
                    height={20}
                  />
                  <p className="font-paragraph-medium text-dark-400_light-700">
                    {profile.user.location}
                  </p>
                </div>
              )}

              <div className="flex-center gap-1">
                <Image
                  src={"/assets/icons/location.svg"}
                  alt="Icon Link"
                  width={20}
                  height={20}
                />
                <p className="font-paragraph-medium text-dark-400_light-700">
                  {format(profile.user.joinedAt, "MMMM yyyy")}
                </p>
              </div>
            </div>

            {profile.user.bio && (
              <p className="font-paragraph-regular text-dark-400_light-800 mt-8">
                {profile.user.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {params.clerkId === profile.user.clerkId && (
              <Link href="/profile/edit">
                <Button className="font-paragraph-medium btn-secondary! text-dark-300_light-900 min-h-[46px] min-w-[175px] px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>

      <ProfileStats
        reputation={profile.user.reputation}
        totalQuestions={profile.count.questionCreated}
        totalAnswers={profile.count.answerCreated}
        badge={profile.badge}
      />

      <div className="mt-10 flex gap-10 max-md:flex-col-reverse">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="bg-light-800_dark-400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab!">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab!">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="top-posts"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <QuestionTab
              clerkId={profile.user.clerkId}
              page={
                isNaN(Number(searchParams.page)) ? 1 : Number(searchParams.page)
              }
            />
          </TabsContent>
          <TabsContent value="answers" className="flex w-full flex-col gap-6">
            <AnswerTab
              clerkId={profile.user.clerkId}
              page={
                isNaN(Number(searchParams.page)) ? 1 : Number(searchParams.page)
              }
            />
          </TabsContent>
        </Tabs>

        <div>
          <h3 className="font-h3-bold text-dark-200_light-900">Top Tags</h3>
          <div className="mt-7 flex flex-col gap-4">
            {toptags.map(({ tag, count }) => (
              <RenderTag
                key={tag.id}
                id={tag.id}
                name={tag.name}
                totalQuestions={count}
                showCount
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

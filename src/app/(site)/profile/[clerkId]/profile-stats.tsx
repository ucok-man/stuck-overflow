import { formatAndDivideNumber } from "@/lib/utils";
import Image from "next/image";

// interface StatsCardProps

type Props = {
  totalQuestions: number;
  totalAnswers: number;
  badge: {
    BRONZE: number;
    SILVER: number;
    GOLD: number;
  };
  reputation: number;
};

export default function ProfileStats(props: Props) {
  return (
    <div className="mt-10">
      <h4 className="font-h3-semibold text-dark-200_light-900">
        Reputation - {props.reputation}
      </h4>

      <div className="xs:grid-cols-2 mt-5 grid grid-cols-1 gap-5 text-center md:grid-cols-4">
        <div className="border-light bg-light-900_dark-300 shadow-light-300 dark:shadow-dark-200 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6">
          <div>
            <p className="font-paragraph-semibold text-dark-200_light-900">
              {formatAndDivideNumber(props.totalQuestions)}
            </p>
            <p className="font-body-medium text-dark-400_light-700">
              Questions
            </p>
          </div>
          <div>
            <p className="font-paragraph-semibold text-dark-200_light-900">
              {formatAndDivideNumber(props.totalAnswers)}
            </p>
            <p className="font-body-medium text-dark-400_light-700">Answers</p>
          </div>
        </div>

        <StatsCard
          imgUrl="/assets/icons/gold-medal.svg"
          value={props.badge.GOLD}
          title="Gold Badges"
        />

        <StatsCard
          imgUrl="/assets/icons/silver-medal.svg"
          value={props.badge.SILVER}
          title="Silver Badges"
        />

        <StatsCard
          imgUrl="/assets/icons/bronze-medal.svg"
          value={props.badge.BRONZE}
          title="Bronze Badges"
        />
      </div>
    </div>
  );
}

const StatsCard = (props: { imgUrl: string; value: number; title: string }) => {
  return (
    <div className="border-light bg-light-900_dark-300 shadow-light-300 dark:shadow-dark-200 flex flex-wrap items-center justify-center gap-4 rounded-md border p-6">
      <Image
        className="shrink-0"
        src={props.imgUrl}
        alt={props.title}
        width={40}
        height={50}
      />
      <div>
        <p className="font-paragraph-semibold text-dark-200_light-900">
          {props.value}
        </p>
        <p className="font-body-medium text-dark-400_light-700">
          {props.title}
        </p>
      </div>
    </div>
  );
};

import { Media } from "@e7na/api-spec";
import { Video, asyncWrapper, getTrailers } from "~/utils";
import MediaWidget from "~/components/media_widget";
import Row from "~/components/row";
import Banner from "~/components/banner";

interface MoviesProps {
  params: {
    type: "Row" | "Banner" | "Poster";
    media?: Media;
    medias?: Media[];
    title?: string;
    category?: string;
    hideInfo?: boolean;
  };
}

const fetchTrailers = async ({ media }: {
  media: Media;
}) => {
  const trailers = await getTrailers(
    media!.MediaID,
    media!.Category
  );
  return trailers;
};

export default asyncWrapper(async function ComponentWidget({
  params,
}: MoviesProps) {
  const { type, media, medias, title, category , hideInfo} = params;
  let trailer: Video | undefined;
  type == "Banner" && media ? trailer = await fetchTrailers({ media }) : null;

  return (
    <div>
      {type == "Row" && (
        <div>
          <Row media={medias!} title={title!} category={category!} />
        </div>
      )}
      {type == "Poster" && (
        <div>
          <MediaWidget media={media! as Media} />
        </div>
      )}
      {type == "Banner" && (
        <div>
          <Banner media={(media as Media)} trailer={trailer!} hideInfo={hideInfo} />
        </div>
      )}
    </div>
  );
});

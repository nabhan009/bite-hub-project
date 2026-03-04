import RestaurantHistory from "@/app/components/RestaurantHistory";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {

  const { id } = await params;

  console.log("PARAM ID:", id);

  return <RestaurantHistory id={id} />;
};

export default Page;
import { useRouter } from "next/router";

const RestaurantPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <>{id}</>;
};

export default RestaurantPage;

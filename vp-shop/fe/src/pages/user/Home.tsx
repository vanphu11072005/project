import Products from "./Products";
import Banner from "../../components/user/Banner";
import CategoryMenu from "../../components/user/CategoryMenu";

function Home() {
  return (
    <div className="p-4">
      {/* Banner */}
      <Banner />

      {/* Category */}
      <CategoryMenu />

      {/* Grid sản phẩm */}
      <Products />
    </div>
  );
}

export default Home;

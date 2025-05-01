import { Image } from "primereact/image";

const Loading = () => {
  return (
    <div className="w-full h-full flex justify-content-center align-items-center">
      <Image src="/images/loading.webp" width="200px" height="200px" />
    </div>
  );
};

export default Loading;

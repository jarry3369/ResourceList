import { useState } from "react";
import { useToast } from "@chakra-ui/toast";

function useResources() {
  const toast = useToast({
    duration: 9000,
    isClosable: true,
    position: "bottom-right",
  });
  const [resources, setResources] = useState<Array<TViewerTarget>>([]);

  function validate() {
    return new Promise((resolve, reject) => {
      setTimeout(
        () => resolve(20 >= Math.floor(Math.random() * 100)),
        Math.floor(Math.random() * 701) + 300
      );
    });
  }

  const addURL = async (url: string) => {
    if (!(url.startsWith("https://") || url.startsWith("http://")))
      return toast({
        title: `url must contain a schema ( https:// or http:// ).`,
        status: "error",
      });

    let target_url: string = url;

    // https://www.youtube.com/watch?v=7txuXlYNR48
    if (url.includes("/watch?v=")) {
      target_url = `https://www.youtube.com/embed/${url.split("/watch?v=")[1]}`;
    }

    // https://youtu.be/7txuXlYNR48?si=Lm3uasv9K4QnJf3P
    if (url.includes("youtu.be/")) {
      target_url = `https://www.youtube.com/embed/${
        url.split("youtu.be/")[1].split("?")[0]
      }`;
    }

    console.log(target_url);

    const v = await validate();
    if (v)
      return toast({
        title: `URL is failed to upload`,
        status: "error",
      });

    setResources((prev) =>
      prev.concat({
        name: url,
        key: crypto.randomUUID(),
        src: target_url,
      })
    );

    toast({
      title: `URL is uploaded`,
      status: "success",
    });
  };

  const addImages = (files: FileList) => {
    if (!files) return;
    const valide: Array<File> = [];

    const validate_image = (target: File): boolean => {
      const { type } = target;
      const [cat, ext] = type.split("/");

      return cat === "image" && ["png", "jpg"].includes(ext);
    };

    for (let i = 0; i < files.length; i++) {
      if (validate_image(files[i])) {
        valide.push(files[i]);
      } else {
        alert(`${files[i].name} is not allowed`);
      }
    }

    valide.forEach(async (file) => {
      const v = await validate();
      if (v)
        return toast({
          title: `${file.name} is failed to upload`,
          status: "error",
        });

      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setResources((prev) =>
          prev.concat({
            name: file.name,
            key: crypto.randomUUID(),
            src: reader.result as string,
          })
        );

        toast({
          title: `${file.name} is uploaded`,
          status: "success",
        });
      };
    });
  };

  const modifyingResourceName = (
    key: string,
    name: string,
    callback?: (newObj: TViewerTarget | null) => void
  ) => {
    let newObj: TViewerTarget | null = null;
    setResources((prev) => {
      return prev.map((p) => {
        if (p.key === key) {
          newObj = { ...p, name };
          return newObj;
        } else return p;
      });
    });
    callback && callback(newObj);
  };

  const removeResource = (key: string, callback?: Function) => {
    setResources((prev) => prev.filter((r) => r?.key !== key));
    callback && callback();
  };

  return {
    resources,
    addURL,
    addImages,
    modifyingResourceName,
    removeResource,
  };
}

export default useResources;

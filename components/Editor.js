import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { postData } from "@/utils/fetchData";
import { useEffect, useContext, useState } from "react";
import { DataContext } from "@/context/AppProviders";

function Editor({ content, setContent }) {
  const { state, dispatch } = useContext(DataContext);

  const uploadAdapter = (loader) => {
    return {
      upload: () => {
        return new Promise(async (resolve, reject) => {
          const body = new FormData();
          try {
            const file = await loader.file;
            body.append("images", file);
            const res = await postData(`/image/upload`, body, {
              timeout: 10000,
              headers: {
                "content-type": "multipart/form-data",
              },
            });
            resolve({
              default: `${process.env.BASE_WEB_URL}${res.images[0].url}`,
            });
          } catch (err) {
            console.log(err);
            reject(err.message);
          }
        });
      },
    };
  };

  const uploadPlugin = (editor) => {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  };

  return (
    <CKEditor
      editor={ClassicEditor}
      data={content}
      onChange={(event, editor) => {
        const data = editor.getData();
        setContent(data);
      }}
      onReady={(editor) => {
        uploadPlugin(editor);
      }}
    />
  );
}

export default Editor;

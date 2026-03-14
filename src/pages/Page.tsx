import { FunctionalComponent, isValidElement, toChildArray } from "preact";
import css from "simpledotcss/simple.min.css" with { type: "text" };

const PageHeadTitle: FunctionalComponent<{ title: string }> = ({ title }) => {
  return <title>{title}</title>;
};

const PageHead: FunctionalComponent & { Title: typeof PageHeadTitle } = (
  { children },
) => {
  const childArr = toChildArray(children);
  const titleComponent = childArr.find((c) =>
    isValidElement(c) && c.type === PageHeadTitle
  );

  return (
    <head>
      <meta charset="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      {titleComponent}
      <style
        dangerouslySetInnerHTML={{
          __html: `preact-island { display: contents; } ${css}`,
        }}
      />
    </head>
  );
};

PageHead.Title = PageHeadTitle;

const PageBody: FunctionalComponent = ({ children }) => {
  return <body>{children}</body>;
};

export const Page: FunctionalComponent & {
  Head: typeof PageHead;
  Body: typeof PageBody;
} = (
  { children },
) => {
  const childArr = toChildArray(children);
  const headComponent = childArr.find((c) =>
    isValidElement(c) && c.type === PageHead
  );
  const bodyComponent = childArr.find((c) =>
    isValidElement(c) && c.type === PageBody
  );

  return (
    <html>
      {headComponent}
      {bodyComponent}
    </html>
  );
};

Page.Head = PageHead;
Page.Body = PageBody;

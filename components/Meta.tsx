import Head from "next/head";

type Props = {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  slug?: string;
};

const Meta: React.FC<Props> = (props) => {
  const { image, type, children, slug } = props;
  const description = props.description ?? "";
  const title = props.title ? `${props.title} - hinagiku` : `hinagiku`;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:site" content="@oshanQQ" />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content={
          image
            ? image
            : "https://images.ctfassets.net/6ncgqkwh9qvt/6nvWJT1AkM64so8Auue4QQ/e22a236a03eb69a86b9696a4d9b6886d/EngineeringHistory.png"
        }
      />
      <meta name="twitter:card" content="summary" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={slug} />
      <meta
        property="og:image"
        content={
          image
            ? image
            : "https://images.ctfassets.net/6ncgqkwh9qvt/6nvWJT1AkM64so8Auue4QQ/e22a236a03eb69a86b9696a4d9b6886d/EngineeringHistory.png"
        }
      />
      {children}
    </Head>
  );
};

export default Meta;

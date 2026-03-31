const PageHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <>
      <h1 className="text-neutral-text-strong text-display-24 break-keep md:text-display-32">
        {title}
      </h1>
      <h2 className="text-neutral-text-default text-body-14 break-keep md:text-body-16">
        {subtitle}
      </h2>
    </>
  );
};

export default PageHeader;

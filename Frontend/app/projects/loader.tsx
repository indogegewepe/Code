import { Container, Center } from '@mantine/core';

export function Loader() {
  return (
    <Container>
      <div className="loaderContainer">
        <span className="loader" />
      </div>
    </Container>
  );
}

export function LoaderNews() {
  return (
    <Center className="p-12">
      <span className="loader" />
    </Center>
  );
}

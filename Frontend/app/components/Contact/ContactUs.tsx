import { Container, SimpleGrid, Title } from '@mantine/core';
import { ContactIconsList } from './ContactIcons';
import classes from './ContactUs.module.css';

export default function ContactUs() {
  return (
    <Container fluid className="heroContact pb-6 rounded-md">
      <Container size="lg" className="contactContent">
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={50}>
          <div>
            <Title className={classes.title} mb={30}>
              Contact us
            </Title>
            <ContactIconsList />
          </div>
          <div className="border-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d988.2280641123622!2d110.3531611061824!3d-7.799114114092087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a57f51f6324ff%3A0x749c8f486ef30808!2sJl.%20Lembu%20Andini%20No.1%2C%20Pakuncen%2C%20Wirobrajan%2C%20Kota%20Yogyakarta%2C%20Daerah%20Istimewa%20Yogyakarta%2055253!5e0!3m2!1sid!2sid!4v1751392026100!5m2!1sid!2sid"
              title="Google map"
              style={{ border: 0, borderRadius: '10px' }}
              className="size-full"
            />
          </div>
        </SimpleGrid>
      </Container>
    </Container>
  );
}

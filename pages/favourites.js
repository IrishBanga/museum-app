import ArtworkCard from '@/src/components/ArtworkCard';
import { favouritesAtom } from '@/store';
import { useAtom } from 'jotai';
import { Col, Row } from 'react-bootstrap';
import { Card } from 'react-bootstrap';

export default function Favourites() {
  const [favourites] = useAtom(favouritesAtom);

  if (!favourites) return null;

  return (
    <>
      <br />
      <br />
      <Row className="gy-4">
        {favourites?.length > 0 ? (
          favourites.map((objectID) => {
            return (
              <Col lg={3} key={objectID}>
                <ArtworkCard objectID={objectID} />
              </Col>
            );
          })
        ) : (
          <Col>
            <Card>
              <Card.Body>
                <h4>Nothing Here</h4>
                Try adding some new artwork to your favourites.
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </>
  );
}

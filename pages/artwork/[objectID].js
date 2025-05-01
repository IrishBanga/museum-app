import { useRouter } from 'next/router';
import { Col, Row } from 'react-bootstrap';

import ArtworkCardDetail from '../../src/components/ArtworkCardDetail';

export default function ArtworkById() {
  const router = useRouter();
  const { objectID } = router.query;

  return (
    <Row>
      <Col>
        <ArtworkCardDetail objectID={objectID} />
      </Col>
    </Row>
  );
}

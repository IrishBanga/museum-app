import validObjectIDList from '@/public/data/validObjectIDList.json';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Pagination } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import useSWR from 'swr';

import ArtworkCard from '../../src/components/ArtworkCard';

export default function ArtworkPage() {
  const router = useRouter();
  let finalQuery = router.asPath.split('?')[1];

  const [page, setPage] = useState(1);
  const [artworkList, setArtworkList] = useState();

  const PER_PAGE = 12;
  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`
  );

  useEffect(() => {
    let filteredResults = validObjectIDList.objectIDs.filter((x) => data?.objectIDs?.includes(x));
    if (filteredResults.length > 0) {
      const results = [];
      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        const chunk = filteredResults.slice(i, i + PER_PAGE);
        results.push(chunk);
      }
      setArtworkList(results);
      setPage(1);
    }
  }, [data]);

  if (error) return <Error statusCode={404} />;

  function previousPage() {
    if (page > 1) setPage(page - 1);
  }

  function nextPage() {
    if (page < artworkList.length) setPage(page + 1);
  }

  return (
    <>
      <br />
      <br />
      <Row className="gy-4">
        {artworkList?.length > 0 ? (
          artworkList[page - 1].map((objectID) => {
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
                Try searching for something else.
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
      {artworkList?.length > 0 && (
        <Row>
          <Col>
            <Pagination>
              <Pagination.Prev onClick={previousPage} />
              <Pagination.Item>{page}</Pagination.Item>
              <Pagination.Next onClick={nextPage} />
            </Pagination>
          </Col>
        </Row>
      )}
    </>
  );
}

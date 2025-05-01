import Error from 'next/error';
import Link from 'next/link';
import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import useSWR from 'swr';

export default function ArtworkCard({ objectID }) {
  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
  );

  if (error) {
    if (error.info.message === 'Not a valid object') {
      return (
        <>
          <Card
            style={{
              height: '575px',
            }}>
            <Card.Img
              variant="top"
              src={'/assets/placeholder.svg'}
              alt="Invalid object"
              style={{
                width: '100%',
                height: '375px',
                objectFit: 'contain',
              }}
            />
            <Card.Body>
              <Card.Title>Error - 404 Not Found</Card.Title>
              <Card.Text>
                <strong>Object ID: </strong>
                {objectID}
              </Card.Text>
            </Card.Body>
          </Card>
        </>
      );
    } else {
      return <Error statusCode={error.status} />;
    }
  }
  if (!data) return null;

  return (
    <Card>
      <Card.Img
        variant="top"
        onError={(event) => {
          console.log('Image not found:', event.target.src);
          event.target.onerror = null;
          event.target.src = '/assets/placeholder.svg';
          event.target.alt = 'Image not available';
        }}
        src={data.primaryImageSmall ? data.primaryImageSmall : '/assets/placeholder.svg'}
        alt={data.title || 'Info not available'}
        style={{
          width: '100%',
          height: '375px',
          objectFit: 'contain',
        }}
      />

      <Card.Body>
        <Card.Title
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
          {data.title || 'N/A'}
        </Card.Title>
        <Card.Text>
          <strong>Date: </strong>
          {data.objectDate || 'N/A'}
          <br />
          <strong>Classification: </strong>
          {data.classification || 'N/A'}
          <br />
          <strong>Medium: </strong>
          {data.medium || 'N/A'}
          <br />
        </Card.Text>
        <Link href={`/artwork/${objectID}`} passHref>
          <Button variant="primary">{objectID}</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

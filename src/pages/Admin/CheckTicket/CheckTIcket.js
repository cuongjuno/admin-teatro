import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import QrReader from 'react-qr-reader';
import './style.scss';

function CheckTicket() {
  const [result, setResult] = useState('');
  const [dataTicket, setDataTicket] = useState({
    expiredTime: '2021-12-13T03:00:49.815383',
    customer: {
      name: 'user',
      email: 'user@example.com',
      phoneNumber: '11111111'
    },
    seats: ['E5', 'E6']
  });
  const qrReader1 = useRef(null);
  const previewStyle = {
    height: 240,
    width: 320
  };

  function handleScan(rs) {
    if (rs) {
      setResult(rs);
    }
  }
  function handleError(err) {
    console.error(err);
  }

  const getDataTicket = async () => {
    axios.get(result).then((res) => {
      setDataTicket({ ...res.data, seats: ['E5', 'E6'] });
    });
  };

  useEffect(() => {
    if (result) getDataTicket();
  }, [result]);

  return (
    <div style={{ height: '40vh' }}>
      <div className="cldmm">
        <QrReader
          ref={qrReader1}
          delay={500}
          style={previewStyle}
          onError={handleError}
          onScan={handleScan}
          legacyMode
          className="qr-code"
        />
        <div className="infor-ticket">
          <h1>Infor Ticket</h1>
          {result && (
            <>
              <h5>Name: {dataTicket.customer.name}</h5>
              <h5>Email: {dataTicket.customer.email}</h5>
              <h5>Phone Number: {dataTicket.customer.phoneNumber}</h5>
              <h5>Seats: {dataTicket.seats?.toString()}</h5>
              <h5>
                Expired Time:{' '}
                {moment(dataTicket.expiredTime).format('dd-mm-yy')}
              </h5>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckTicket;

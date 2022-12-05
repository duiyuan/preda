import * as React from 'react';
type AddressTextProps = {
  addr: string;
  addrIndex?: string;
};

const AddressText = ({
  addr,
  addrIndex,
}: AddressTextProps) => {
  const [addrHash, addrFlag] = addr.split(':')
  return (
    <div className="address-text">
      {addrIndex ? <span className="address-index">{addrIndex}</span> : null}
      <span  className="address-hash">({addrHash}</span>
      <span className="address-flag">{addrFlag}</span>)
    </div>
  );
};

export default AddressText;
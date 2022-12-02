import { toShard } from '@/utils/strings';
import * as React from 'react'
import MoreSwitch from './MoreSwitch'

export const DeployBox = ({data, key, title}: any) => {
  const [more, setMore] = React.useState<boolean>(false)

  const originData = React.useMemo(() => {
    return  more ? data : [data[0]];
  }, [data, more]);

  return (
    <div className="box deploy-box" key={key}>
      <p className="box-title">{title}</p>
      {originData.map((d: any) => (
        <div className="box-content" key={d.source + d.contract}>
          <div className="deploy-header">
              <div className='deploy-header-item'>
                <p className="box-key">Source</p>
                <p className="box-val">{d.source}</p>
              </div>
              <div className='deploy-header-item'>
                <p className="box-key">Contract</p>
                <p className="box-val">{d.contract}</p>
              </div>
              <div className='deploy-header-item'>
                <p className="box-key">Flag</p>
                <p className="box-val">{d.flag}</p>
              </div>
          </div>
          <div className="deploy-function">
              <p className='deply-fn-title'>Function</p>
              <div className='deploy-list-header'>
                <div className='box-key'>Name</div>
                <div className='box-key'>Flag</div>
                <div className='box-key'>Opcode</div>
              </div>
              <div className="deploy-fn-list">
                {d.functions.map((fn: any) => (
                  <>
                    <div className='box-val'>{fn.name}</div>
                    <div className='box-val'>{fn.flag}</div>
                    <div className='box-val'>{fn.opcode}</div>
                  </>
                ))}
              </div>
          </div>
        </div>
      ))}
      {data.length > 1 ? (
        <div className='center'>
          <MoreSwitch onChange={(s: boolean) => setMore(s)} value={more} />
        </div>
      ) : null}
    </div>
  )
};
export const AddrBox = ({data, key, title}: any) => {
  const [more, setMore] = React.useState<boolean>(false)

  const originData = React.useMemo(() => {
    return  more ? data : [data[0]];
  }, [data, more]);

  return (
    <div className="box addr-box" key={key}>
      <p className="box-title">{title}</p>
        <div className="box-content" >
          {originData.map((d: any) => (
            <div className='addr-item'>
                <div className="addr-header" key={d.Address}>
                  Address: {d.AddressIndex}({d.Address})
                </div>
                <div className="addr-shard"> 
                  {d.States.map((s: any) => (
                    <div className='addr-state'>
                      <div className='box-key'>Contract:</div>
                      <div className='box-val'>{s.Contract}</div>
                      <div className='box-key'>State:</div>
                      <div className='box-val'>voredWeights:[{s.State.weight},{s.State.voted_case}]</div>
                    </div>
                  ))}
                </div>
            </div>
          ))}
          {data.length > 1 ? (
            <div className='center'>
              <MoreSwitch onChange={(s: boolean) => setMore(s)} value={more} />
            </div>
          ) : null}
      </div>      
      
    </div>
  )
};


import React from 'react'
import InputCounter from './InputCounter'
import InputStyles from '../styles/InputCounter.module.scss'
const EffectInput = ({text, value, onChange}) => {
  return (
    <div className={InputStyles.EffectInput} style={{fontSize:'12px',display:'flex',alignItems:'center'}}>
        <span>{text || ''}</span>
        <InputCounter inputWidth={'100%'} min={0} max={100000000000} value={value} onChange={onChange}  />
    </div>
  )
}

export default EffectInput
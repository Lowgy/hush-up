import '../app/styles.css';
import { useContext, useEffect } from 'react';
import { gsap } from 'gsap';
import UserContext from '@/context/user';

type LeverProps = {
  leverClick: () => void;
  leverPulled: boolean;
};

export default function Lever({ leverClick, leverPulled }: LeverProps) {
  const { role } = useContext(UserContext);
  //on lever click, run animation
  useEffect(() => {
    if (leverPulled) {
      gsap.fromTo(
        '.lever',
        { rotate: 30 },
        { rotate: -80, duration: '1', repeat: 0, ease: 'Sine.out' }
      );
    }
  }, [leverPulled]);

  return (
    <button
      id="leverControl"
      className={`${role === 'not safe' ? 'pointer' : ''} lever-control`}
      onClick={leverClick}
      disabled={role === 'not safe' ? false : true}
    >
      <div className="lever">
        <div className="knob"></div>
        <div className="stick"></div>
      </div>
      <div className="lever-base">
        <div className="pivot"></div>
      </div>
    </button>
  );
}

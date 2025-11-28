import {CgSpinnerTwoAlt} from 'react-icons/cg';

const Loader = () => (
  <>
    <style>{`
				@keyframes spin {
					from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
				}
			`}</style>
    <CgSpinnerTwoAlt
      size='24'
      style={{animation: 'spin 1s linear infinite'}}
    />
  </>
);

export default Loader;

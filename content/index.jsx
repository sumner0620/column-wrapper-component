import backgroundOptionsComponent from '../../assets/scripts/hocs/backgroundOptionsWrapper';
import personalizationWrapper from '../../assets/scripts/hocs/personalizationWrapper';
import Content from './content';

export default backgroundOptionsComponent(personalizationWrapper(Content));

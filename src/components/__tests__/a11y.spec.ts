import { render } from '@testing-library/vue';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import AccessDataScreen from '../AccessDataScreen.vue';
import BeneficiosSection from '../BeneficiosSection.vue';
import ComoFuncionaSection from '../ComoFuncionaSection.vue';
import DadosPessoaisScreen from '../DadosPessoaisScreen.vue';
import FooterSection from '../FooterSection.vue';
import HeroSection from '../HeroSection.vue';
import PropostaPersonalizadaScreen from '../PropostaPersonalizadaScreen.vue';
import PropostaScreen from '../PropostaScreen.vue';
import SenhaScreen from '../SenhaScreen.vue';
import SimuladorSection from '../SimuladorSection.vue';

const cases = [
  { name: 'HeroSection', component: HeroSection },
  { name: 'SimuladorSection', component: SimuladorSection },
  { name: 'ComoFuncionaSection', component: ComoFuncionaSection },
  { name: 'BeneficiosSection', component: BeneficiosSection },
  { name: 'FooterSection', component: FooterSection },
  { name: 'PropostaScreen', component: PropostaScreen },
  { name: 'PropostaPersonalizadaScreen', component: PropostaPersonalizadaScreen },
  { name: 'AccessDataScreen', component: AccessDataScreen },
  {
    name: 'SenhaScreen',
    component: SenhaScreen,
    props: {
      celular: '(11) 99999-9999',
      canal: 'celular',
    },
  },
  { name: 'DadosPessoaisScreen', component: DadosPessoaisScreen },
];

describe('a11y do projeto consumidor', () => {
  it.each(cases)('renderiza %s sem violações automáticas básicas de acessibilidade', async ({ component, props }) => {
    const { container } = render(component, { props });
    const results = await axe(container, {
      rules: {
        region: { enabled: false },
      },
    });

    expect(results).toHaveNoViolations();
  });
});
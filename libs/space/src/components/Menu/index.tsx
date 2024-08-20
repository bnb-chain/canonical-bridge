import {
  AppsIcon,
  BlogIcon,
  BNBChainIcon,
  BscScanIcon,
  BscTraceIcon,
  BuildIcon,
  CodeSquareIcon,
  ConversionPathIcon,
  CubeIcon,
  DCellarIcon,
  DocumentIcon,
  EventIcon,
  ExploreIcon,
  FaucetIcon,
  GitHubIcon,
  IdeaIcon,
  ListIcon,
  MessageIcon,
  MoneyCircleIcon,
  ProgramIcon,
  PsychologyIcon,
  SafeIcon,
  WalletIcon,
  WarningTriangleSolidIcon,
} from '@bnb-chain/icons';
import { useIntl } from 'react-intl';

import { ANALYTICS_IDS } from '../Header/analytics';
import { DataProps, Level1Props } from '../Header/types';

import { BNB_CHAIN, GREENFIELD_CHAIN, OPBNB_CHAIN } from './constants';
import { PcMenu } from './PcMenu';
import { TabletMenu } from './TabletMenu';
import { MobileMenu } from './MobileMenu';

export const Menu = ({
  tablet,
  mobile,
  menus,
}: {
  tablet?: boolean;
  mobile?: boolean;
  menus?: Level1Props[];
}) => {
  const { locale } = useIntl();
  const { formatMessage } = useIntl();

  const data: DataProps = menus?.length
    ? menus
    : [
        {
          id: 'Chains',
          name: formatMessage({
            id: 'header.solutions.title',
          }),
          desc: '',
          image: '',
          analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution,
          children: [
            {
              name: formatMessage({
                id: 'header.solutions.sub.bnbchain.name',
              }),
              desc: formatMessage({
                id: 'header.solutions.sub.bnbchain.desc',
              }),
              title: formatMessage({ id: 'header.solutions.sub.bnbchain.subpanel.name' }),
              selfLink: `https://www.bnbchain.org/${locale}/bnb-smart-chain`,
              selfAnalyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_bsc,
              thumbnailLink: {
                href: `https://www.bnbchain.org/${locale}/bnb-smart-chain`,
                name: formatMessage({
                  id: 'learn.more',
                }),
              },
              thumbnailAnalyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_bsc_page,
              wallet: {
                options: [
                  {
                    tooltipContent: formatMessage({
                      id: 'add.network.bnbchain.tw.tooltip',
                    }),
                    analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_bsc_TWEAddNetwork,
                    chain: BNB_CHAIN,
                    id: 'tw',
                  },
                  {
                    tooltipContent: formatMessage({ id: 'add.network.bnbchain.metamask.tooltip' }),
                    analyticsId:
                      ANALYTICS_IDS['solutions'].click_menu_solution_bsc_MetaMaskAddNetwork,
                    chain: BNB_CHAIN,
                    id: 'metamask',
                  },
                ],
                title: formatMessage({
                  id: 'add.network.bnbchain.description',
                }),
              },
              children: [
                {
                  icon: DocumentIcon,
                  name: formatMessage({
                    id: 'header.solutions.sub.bnbchain.sub.document.name',
                  }),
                  desc: formatMessage({
                    id: 'header.solutions.sub.bnbchain.sub.document.desc',
                  }),
                  target: '_blank',
                  link: 'https://docs.bnbchain.org/bnb-smart-chain/',
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_bsc_doc,
                },
                {
                  icon: GitHubIcon,
                  name: formatMessage({ id: 'header.solutions.sub.bnbchain.sub.github.name' }),
                  desc: formatMessage({ id: 'header.solutions.sub.bnbchain.sub.github.desc' }),
                  target: '_blank',
                  link: 'https://github.com/bnb-chain/bsc',
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_bsc_GitHub,
                },
                {
                  icon: FaucetIcon,
                  name: formatMessage({ id: 'header.solutions.sub.bnbchain.sub.faucet.name' }),
                  desc: formatMessage({ id: 'header.solutions.sub.bnbchain.sub.faucet.desc' }),
                  target: '_blank',
                  link: `https://www.bnbchain.org/${locale}/testnet-faucet`,
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_bsc_faucet,
                },
                {
                  icon: SafeIcon,
                  name: formatMessage({ id: 'header.solutions.sub.bnbchain.sub.staking.name' }),
                  desc: formatMessage({ id: 'header.solutions.sub.bnbchain.sub.staking.desc' }),
                  target: '_self',
                  link: `https://www.bnbchain.org/${locale}/bnb-staking`,
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_bsc_staking,
                },
                {
                  icon: BscScanIcon,
                  name: formatMessage({ id: 'header.solutions.sub.bnbchain.sub.bscscan.name' }),
                  target: '_blank',
                  desc: formatMessage({
                    id: 'header.solutions.sub.bnbchain.sub.bscscan.desc',
                  }),
                  link: 'https://bscscan.com',
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_bsc_BscScan,
                },
                {
                  icon: BscTraceIcon,
                  name: formatMessage({ id: 'header.solutions.sub.bnbchain.sub.bsctrace.name' }),
                  target: '_blank',
                  desc: formatMessage({ id: 'header.solutions.sub.bnbchain.sub.bsctrace.desc' }),
                  link: 'https://bsctrace.com',
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_bsc_BSCTrace,
                },
                {
                  icon: BuildIcon,
                  name: formatMessage({ id: 'header.solutions.sub.devTools.name' }),
                  desc: formatMessage({ id: 'header.solutions.sub.devTools.desc' }),
                  target: '',
                  link: `https://www.bnbchain.org/${locale}/dev-tools?chain=bsc`,
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_bsc_DevTools,
                },
              ],
            },
            {
              name: formatMessage({
                id: 'header.solutions.sub.bnbbeaconchain.name',
              }),
              desc: formatMessage({
                id: 'header.solutions.sub.bnbbeaconchain.desc',
              }),
              tag: {
                name: formatMessage({ id: 'header.solutions.tag.sunset' }),
                variant: 'warning',
                link: `https://www.bnbchain.org/${locale}/bnb-chain-fusion`,
                target: '_self',
              },
              children: [
                {
                  icon: WarningTriangleSolidIcon,
                  name: formatMessage({
                    id: 'header.solutions.sub.bnbbeaconchain.sub.fusion.name',
                  }),
                  desc: '',
                  link: `https://www.bnbchain.org/${locale}/bnb-chain-fusion`,
                  target: '_self',
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_beacon_fusion,
                },
                {
                  icon: DocumentIcon,
                  name: formatMessage({
                    id: 'header.solutions.sub.bnbbeaconchain.sub.document.name',
                  }),
                  desc: formatMessage({
                    id: 'header.solutions.sub.bnbbeaconchain.sub.document.desc',
                  }),
                  link: 'https://docs.bnbchain.org/bnb-smart-chain/',
                  target: '_blank',
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_beacon_doc,
                },
                {
                  icon: ExploreIcon,
                  name: formatMessage({
                    id: 'header.solutions.sub.bnbbeaconchain.sub.beacon-chain-explore.name',
                  }),
                  desc: formatMessage({
                    id: 'header.solutions.sub.bnbbeaconchain.sub.beacon-chain-explore.desc',
                  }),
                  link: 'https://explorer.bnbchain.org',
                  target: '_blank',
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_beacon_explorer,
                },
                {
                  icon: SafeIcon,
                  name: formatMessage({ id: 'header.solutions.sub.bnbbeaconchain.sub.stake.name' }),
                  desc: formatMessage({
                    id: 'header.solutions.sub.bnbbeaconchain.sub.stake.desc',
                  }),
                  link: 'https://www.bnbchain.org/en/staking',
                  target: '_self',
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_beacon_staking,
                  tag: {
                    name: formatMessage({ id: 'header.solutions.tag.sunset' }),
                    variant: 'warning',
                  },
                },
              ],
            },
            {
              name: formatMessage({
                id: 'header.solutions.sub.greenfield.name',
              }),
              desc: formatMessage({
                id: 'header.solutions.sub.greenfield.desc',
              }),
              title: formatMessage({ id: 'header.solutions.sub.greenfield.subpanel.name' }),
              selfLink: `https://greenfield.bnbchain.org/${locale}`,
              selfAnalyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_gf,
              thumbnailLink: {
                href: `https://greenfield.bnbchain.org/${locale}`,
                name: formatMessage({
                  id: 'learn.more',
                }),
              },
              thumbnailAnalyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_gf_page,
              wallet: {
                options: [
                  {
                    tooltipContent: formatMessage({
                      id: 'add.network.greenfield.tw.tooltip',
                    }),
                    analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_gf_TWEAddNetwork,
                    chain: GREENFIELD_CHAIN,
                    id: 'tw',
                  },
                  {
                    tooltipContent: formatMessage({
                      id: 'add.network.greenfield.metamask.tooltip',
                    }),
                    analyticsId:
                      ANALYTICS_IDS['solutions'].click_menu_solution_gf_MetaMaskAddNetwork,
                    chain: GREENFIELD_CHAIN,
                    id: 'metamask',
                  },
                ],
                title: formatMessage({
                  id: 'add.network.greenfield.description',
                }),
              },
              children: [
                {
                  icon: DocumentIcon,
                  name: formatMessage({
                    id: 'header.solutions.sub.greenfield.sub.document.name',
                  }),
                  desc: formatMessage({
                    id: 'header.solutions.sub.greenfield.sub.document.desc',
                  }),
                  link: 'https://docs.bnbchain.org/bnb-greenfield/',
                  target: '_blank',
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_gf_doc,
                },
                {
                  icon: GitHubIcon,
                  name: formatMessage({
                    id: 'header.solutions.sub.greenfield.sub.github.name',
                  }),
                  desc: formatMessage({
                    id: 'header.solutions.sub.greenfield.sub.github.desc',
                  }),
                  link: 'https://github.com/bnb-chain/greenfield',
                  target: '_blank',
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_gf_GitHub,
                },
                {
                  icon: FaucetIcon,
                  name: formatMessage({ id: 'header.solutions.sub.greenfield.sub.faucet.name' }),
                  desc: formatMessage({
                    id: 'header.solutions.sub.greenfield.sub.faucet.desc',
                  }),
                  target: '_blank',
                  link: 'https://docs.bnbchain.org/bnb-greenfield/getting-started/get-test-bnb/',
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_gf_faucet,
                },
                {
                  icon: ConversionPathIcon,
                  name: formatMessage({
                    id: 'header.solutions.sub.greenfield.sub.bridge.name',
                  }),
                  desc: formatMessage({
                    id: 'header.solutions.sub.greenfield.sub.bridge.desc',
                  }),
                  link: `https://greenfield.bnbchain.org/${locale}/bridge`,
                  target: '_blank',
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_gf_bridge,
                },
                {
                  icon: ExploreIcon,
                  name: formatMessage({
                    id: 'header.solutions.sub.greenfield.sub.greenfieldscan.name',
                  }),
                  desc: formatMessage({
                    id: 'header.solutions.sub.greenfield.sub.greenfieldscan.desc',
                  }),
                  link: 'https://greenfieldscan.com',
                  target: '_blank',
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_gf_GreenfieldScan,
                },
                {
                  icon: DCellarIcon,
                  name: formatMessage({
                    id: 'header.solutions.sub.greenfield.sub.dceller.name',
                  }),
                  desc: formatMessage({
                    id: 'header.solutions.sub.greenfield.sub.dceller.desc',
                  }),
                  link: 'https://dcellar.io/',
                  target: '_blank',
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_gf_dceller,
                },
                {
                  icon: BuildIcon,
                  name: formatMessage({ id: 'header.solutions.sub.devTools.name' }),
                  desc: formatMessage({ id: 'header.solutions.sub.devTools.desc' }),
                  target: '',
                  link: `https://www.bnbchain.org/${locale}/dev-tools?chain=greenfield`,
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_gf_DevTools,
                },
                // {
                //   icon: MindpressIcon,
                //   name: formatMessage({
                //     id: 'header.solutions.sub.greenfield.sub.mindpress.name',
                //   }),
                //   desc: formatMessage({
                //     id: 'header.solutions.sub.greenfield.sub.mindpress.desc',
                //   }),
                //   link: 'https://marketplace.mindexpress.io/',
                //   target: '_target',
                //   analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_gf_dceller,
                // },
              ],
            },
            {
              name: formatMessage({ id: 'header.solutions.sub.opBnb.name' }),
              desc: formatMessage({ id: 'header.solutions.sub.opBnb.desc' }),
              analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_opBNB,
              // tag: {
              //   name: formatMessage({ id: 'header.solutions.tag.testnet' }),
              //   variant: 'outline',
              // },
              title: formatMessage({ id: 'header.solutions.sub.opBnb.subPanel.name' }),
              selfLink: `https://opbnb.bnbchain.org/${locale}`,
              selfAnalyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_opBNB,
              thumbnailLink: {
                href: `https://opbnb.bnbchain.org/${locale}`,
                name: formatMessage({
                  id: 'learn.more',
                }),
              },
              thumbnailAnalyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_opBNB_page,
              wallet: {
                options: [
                  {
                    tooltipContent: formatMessage({
                      id: 'add.network.opbnb.tw.tooltip',
                    }),
                    analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_opBNB_TWEAddNetwork,
                    chain: OPBNB_CHAIN,
                    id: 'tw',
                  },
                  {
                    tooltipContent: formatMessage({
                      id: 'add.network.opbnb.metamask.tooltip',
                    }),
                    analyticsId:
                      ANALYTICS_IDS['solutions'].click_menu_solution_opBNB_MetaMaskAddNetwork,
                    chain: OPBNB_CHAIN,
                    id: 'metamask',
                  },
                ],
                title: formatMessage({
                  id: 'add.network.opbnb.description',
                }),
              },
              children: [
                {
                  icon: DocumentIcon,
                  name: formatMessage({
                    id: 'header.solutions.sub.opBnb.sub.document.name',
                  }),
                  desc: formatMessage({
                    id: 'header.solutions.sub.opBnb.sub.document.desc',
                  }),
                  link: 'https://docs.bnbchain.org/bnb-opbnb/',
                  target: '_blank',
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_opBNB_doc,
                },
                {
                  icon: GitHubIcon,
                  name: formatMessage({
                    id: 'header.solutions.sub.opBnb.sub.github.name',
                  }),
                  desc: formatMessage({
                    id: 'header.solutions.sub.opBnb.sub.github.desc',
                  }),
                  link: 'https://github.com/bnb-chain/opbnb',
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_opBNB_GitHub,
                  target: '_blank',
                },
                {
                  icon: FaucetIcon,
                  name: formatMessage({ id: 'header.solutions.sub.opBnb.sub.faucet.name' }),
                  desc: formatMessage({
                    id: 'header.solutions.sub.opBnb.sub.faucet.desc',
                  }),
                  target: '_blank',
                  link: 'https://docs.bnbchain.org/bnb-opbnb/developers/network-faucet/',
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_opBNB_faucet,
                },
                {
                  icon: ConversionPathIcon,
                  name: formatMessage({
                    id: 'header.solutions.sub.opBnb.sub.bridge.name',
                  }),
                  desc: formatMessage({
                    id: 'header.solutions.sub.opBnb.sub.bridge.desc',
                  }),
                  link: 'https://opbnb-bridge.bnbchain.org',
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_opBNB_bridge,
                  target: '_blank',
                },
                {
                  icon: ExploreIcon,
                  name: formatMessage({
                    id: 'header.solutions.sub.opBnb.sub.explorer.name',
                  }),
                  desc: formatMessage({
                    id: 'header.solutions.sub.opBnb.sub.explorer.desc',
                  }),
                  link: 'https://opbnbscan.com',
                  target: '_blank',
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_opBNB_explorer,
                },
                {
                  icon: BuildIcon,
                  name: formatMessage({ id: 'header.solutions.sub.devTools.name' }),
                  desc: formatMessage({ id: 'header.solutions.sub.devTools.desc' }),
                  target: '',
                  link: `https://www.bnbchain.org/${locale}/dev-tools?chain=opbnb`,
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_opBNB_DevTools,
                },
              ],
            },
            {
              name: formatMessage({ id: 'header.solutions.sub.zk-bnb.name' }),
              desc: formatMessage({
                id: 'header.solutions.sub.zk-bnb.desc',
              }),
              tag: {
                name: formatMessage({
                  id: 'header.solutions.tag.testnet',
                }),
                variant: 'outline',
              },
              title: formatMessage({ id: 'header.solutions.sub.zk-bnb.name' }),
              selfLink: `https://zkbnb.bnbchain.org`,
              selfAnalyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_zkBNB,
              thumbnailLink: {
                href: `https://zkbnb.bnbchain.org`,
                name: formatMessage({
                  id: 'learn.more',
                }),
              },
              thumbnailAnalyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_zkBNB_page,
              children: [
                {
                  icon: DocumentIcon,
                  name: formatMessage({
                    id: 'header.solutions.sub.zk-bnb.sub.document.name',
                  }),
                  desc: formatMessage({
                    id: 'header.solutions.sub.zk-bnb.sub.document.desc',
                  }),
                  link: 'https://docs.bnbchain.org/zkbnb/',
                  target: '_blank',
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_zkBNB_doc,
                },
                {
                  icon: GitHubIcon,
                  name: formatMessage({ id: 'header.solutions.sub.zk-bnb.sub.github.name' }),
                  desc: formatMessage({ id: 'header.solutions.sub.zk-bnb.sub.github.desc' }),
                  target: '_blank',
                  link: 'https://github.com/bnb-chain/zkbnb',
                  analyticsId: ANALYTICS_IDS['solutions'].click_menu_solution_zkBNB_GitHub,
                },
              ],
            },
            {
              name: formatMessage({ id: 'header.solutions.sub.layer-2.name' }),
              title: formatMessage({ id: 'header.solutions.sub.layer-2.name' }),
              link: `https://www.bnbchain.org/${locale}/layer-2`,
              desc: formatMessage({ id: 'header.solutions.sub.layer-2.desc' }),
            },
          ],
        },
        {
          id: 'Developers',
          name: formatMessage({ id: 'header.developers.title' }),
          desc: formatMessage({
            id: 'header.developers.desc',
          }),
          button: { name: 'Submit dApps', href: '/', target: '_self' },
          image:
            'https://bin.bnbstatic.com/image/admin_mgs_image_upload/20220218/94863af2-c980-42cf-a139-7b9f462a36c2.png',
          analyticsId: ANALYTICS_IDS['developers'].click_menu_developers,
          title: formatMessage({ id: 'header.developers.panel.name' }),
          subtitle: formatMessage({ id: 'header.developers.panel.desc' }),
          selfLink: `https://developer.bnbchain.org`,
          thumbnailLink: {
            href: `https://developer.bnbchain.org`,
            name: formatMessage({
              id: 'header.developers.panel.desc.link.name',
            }),
          },
          thumbnailImage: {
            src: 'https://dex-bin.bnbstatic.com/new/static/images/space/header/developers.png',
            alt: formatMessage({ id: 'header.developers.panel.name' }),
          },
          thumbnailAnalyticsId: ANALYTICS_IDS['developers'].click_menu_dev_developerHome,
          children: [
            {
              icon: DocumentIcon,
              name: formatMessage({ id: 'header.developers.sub.documents.name' }),
              desc: formatMessage({ id: 'header.developers.sub.document.desc' }),
              target: '_blank',
              link: 'https://docs.bnbchain.org/',
              analyticsId: ANALYTICS_IDS['developers'].click_menu_dev_documentation,
              buttonBottom: false,
              children: [
                {
                  name: formatMessage({
                    id: 'header.solutions.sub.bnbchain.name',
                  }),
                  desc: '',
                  target: '_blank',
                  link: `https://docs.bnbchain.org/bnb-smart-chain/`,
                  analyticsId: ANALYTICS_IDS['doc'].click_menu_dev_doc_bsc,
                },
                {
                  name: formatMessage({
                    id: 'header.solutions.sub.greenfield.name',
                  }),
                  desc: '',
                  target: '_blank',
                  link: `https://docs.bnbchain.org/bnb-greenfield/`,
                  analyticsId: ANALYTICS_IDS['doc'].click_menu_dev_doc_gf,
                },
                {
                  name: formatMessage({
                    id: 'header.solutions.sub.opBnb.name',
                  }),
                  desc: '',
                  target: '_blank',
                  link: `https://docs.bnbchain.org/bnb-opbnb/`,
                  analyticsId: ANALYTICS_IDS['doc'].click_menu_dev_doc_opBNB,
                },
                {
                  name: formatMessage({
                    id: 'header.solutions.sub.zk-bnb.name',
                  }),
                  desc: '',
                  target: '_blank',
                  link: `https://docs.bnbchain.org/zkbnb/`,
                  analyticsId: ANALYTICS_IDS['doc'].click_menu_dev_doc_zkBNB,
                },
              ],
            },
            {
              icon: CodeSquareIcon,
              name: formatMessage({ id: 'header.developers.sub.developer-programs.name' }),
              desc: formatMessage({
                id: 'header.developers.sub.developer-programs.desc',
              }),
              analyticsId: ANALYTICS_IDS['developers'].click_menu_dev_devProgs,
              // subLink: `https://www.bnbchain.org/${locale}/developers/developer-programs`,
              link: `https://www.bnbchain.org/${locale}/developers/developer-programs`,
              target: '_self',
              buttonBottom: true,
              children: [
                {
                  name: formatMessage({
                    id: 'header.developers.sub.developer-programs.sub.tv.name',
                  }),
                  desc: formatMessage({
                    id: 'header.developers.sub.developer-programs.sub.tv.desc',
                  }),
                  target: '_self',
                  link: `https://www.bnbchain.org/${locale}/developers/developer-programs/tv-incentive-program`,
                  analyticsId: ANALYTICS_IDS['developers'].click_menu_dev_devProgs_TV,
                },
                {
                  name: formatMessage({
                    id: 'header.developers.sub.developer-programs.sub.dau-incentive.name',
                  }),
                  desc: formatMessage({
                    id: 'header.developers.sub.developer-programs.sub.dau-incentive.desc',
                  }),
                  target: '_self',
                  link: `https://www.bnbchain.org/${locale}/developers/developer-programs/dau-incentive-program`,
                  analyticsId: ANALYTICS_IDS['developers'].click_menu_dev_devProgs_DAU,
                },
                {
                  name: formatMessage({
                    id: 'header.developers.sub.developer-programs.sub.tvl.name',
                  }),
                  desc: formatMessage({
                    id: 'header.developers.sub.developer-programs.sub.tvl.desc',
                  }),
                  target: '_self',
                  link: `https://www.bnbchain.org/${locale}/developers/developer-programs/tvl-incentive-program`,
                  analyticsId: ANALYTICS_IDS['developers'].click_menu_dev_devProgs_TVL,
                },
                {
                  name: formatMessage({
                    id: 'header.developers.sub.developer-programs.sub.kickstart.name',
                  }),
                  desc: formatMessage({
                    id: 'header.developers.sub.developer-programs.sub.kickstart.desc',
                  }),
                  target: '_self',
                  link: `https://www.bnbchain.org/${locale}/developers/developer-programs/kickstart`,
                  analyticsId: ANALYTICS_IDS['developers'].click_menu_dev_devProgs_Kickstart,
                },
                {
                  name: formatMessage({
                    id: 'header.developers.sub.developer-programs.sub.mvb-programs.name',
                  }),
                  target: '_self',
                  desc: formatMessage({
                    id: 'header.developers.sub.developer-programs.sub.mvb-programs.desc',
                  }),
                  link: `https://www.bnbchain.org/${locale}/bsc-mvb-program`,
                  analyticsId: ANALYTICS_IDS['developers'].click_menu_dev_devProgs_MVB,
                },
                {
                  name: formatMessage({
                    id: 'header.community.sub.space-b.name',
                  }),
                  target: '_self',
                  desc: formatMessage({
                    id: 'header.community.sub.space-b.desc',
                  }),
                  link: `https://www.bnbchain.org/${locale}/space-b`,
                  analyticsId: ANALYTICS_IDS['developers'].click_menu_dev_devProgs_SpaceB,
                },
                {
                  name: formatMessage({
                    id: 'header.community.sub.governance.name',
                  }),
                  target: '_self',
                  desc: formatMessage({
                    id: 'header.community.sub.governance.desc',
                  }),
                  link: `https://www.bnbchain.org/${locale}/bnb-chain-governance`,
                  analyticsId: ANALYTICS_IDS['developers'].click_menu_community_governance,
                },
                {
                  name: formatMessage({
                    id: 'header.developers.sub.developer-programs.sub.meme-innovation-program.name',
                  }),
                  target: '_self',
                  desc: formatMessage({
                    id: 'header.developers.sub.developer-programs.sub.meme-innovation-program.desc',
                  }),
                  link: `https://www.bnbchain.org/${locale}/developers/developer-programs/meme-innovation-program`,
                  analyticsId: ANALYTICS_IDS['developers'].click_menu_dev_devProgs_MEME,
                },
                {
                  name: formatMessage({
                    id: 'header.developers.sub.developer-programs.sub.see-all-programs.name',
                  }),
                  target: '_self',
                  desc: '',
                  link: `https://www.bnbchain.org/${locale}/developers/developer-programs`,
                  analyticsId: ANALYTICS_IDS['developers'].click_menu_dev_devProgs_allProgram,
                },
              ],
            },
            {
              icon: GitHubIcon,
              name: formatMessage({ id: 'header.developers.sub.github.name' }),
              desc: formatMessage({ id: 'header.developers.sub.github.desc' }),
              target: '_blank',
              link: 'https://github.com/bnb-chain',
              analyticsId: ANALYTICS_IDS['developers'].click_menu_dev_GitHub,
            },
            {
              icon: BuildIcon,
              name: formatMessage({ id: 'header.developers.sub.tools.name' }),
              desc: formatMessage({ id: 'header.developers.sub.tools.desc' }),
              target: '',
              link: `https://www.bnbchain.org/${locale}/dev-tools`,
              analyticsId: ANALYTICS_IDS['developers'].click_menu_dev_tools,
            },
            {
              icon: FaucetIcon,
              name: formatMessage({ id: 'header.developers.sub.faucet.name' }),
              desc: formatMessage({
                id: 'header.developers.sub.faucet.desc',
              }),
              target: '_blank',
              link: `https://www.bnbchain.org/${locale}/testnet-faucet`,
              analyticsId: ANALYTICS_IDS['developers'].click_menu_dev_faucet,
            },
            {
              icon: MoneyCircleIcon,
              name: formatMessage({ id: 'header.developers.sub.grants.name' }),
              desc: formatMessage({
                id: 'header.developers.sub.grants.desc',
              }),
              target: '_self',
              link: `https://www.bnbchain.org/${locale}/grants`,
              analyticsId: ANALYTICS_IDS['developers'].click_menu_dev_grants,
            },
            {
              icon: PsychologyIcon,
              name: formatMessage({
                id: 'header.community.sub.hackathon.name',
              }),
              desc: formatMessage({
                id: 'header.community.sub.hackathon.desc',
              }),
              target: '_self',
              link: `https://www.bnbchain.org/${locale}/hackathon`,
              analyticsId: ANALYTICS_IDS['developers'].click_menu_dev_hackathon,
            },
            {
              icon: ListIcon,
              name: formatMessage({
                id: 'header.solutions.sub.bnb-side-chain.sub.bnb-chain-list.name',
              }),
              desc: formatMessage({
                id: 'header.solutions.sub.bnb-side-chain.sub.bnb-chain-list.desc',
              }),
              link: 'https://www.bnbchainlist.org',
              analyticsId: ANALYTICS_IDS['developers'].click_menu_dev_BNBChainList,
              target: '_blank',
            },
          ],
        },
        {
          id: 'Ecosystem',
          name: formatMessage({ id: 'header.ecosystem.title' }),
          desc: '',
          image: '',
          analyticsId: ANALYTICS_IDS['ecosystem'].click_menu_ecosystem,
          children: [
            {
              icon: WalletIcon,
              name: formatMessage({
                id: 'header.ecosystem.sub.wallet.name',
              }),
              desc: formatMessage({
                id: 'header.ecosystem.sub.wallet.desc',
              }),
              target: '_self',
              link: `https://www.bnbchain.org/${locale}/wallets`,
              analyticsId: ANALYTICS_IDS['ecosystem'].click_menu_ecosystem_wallets,
            },
            {
              icon: ExploreIcon,
              name: formatMessage({ id: 'header.ecosystem.sub.explore.name' }),
              desc: formatMessage({
                id: 'header.ecosystem.sub.explore.desc',
              }),
              target: '_blank',
              link: `https://dappbay.bnbchain.org?utm_source=Org&utm_medium=Channel&utm_campaign=homepage_240124&utm_content=homepage`,
              analyticsId: ANALYTICS_IDS['ecosystem'].click_menu_ecosystem_exploredApps,
            },
            {
              icon: SafeIcon,
              name: formatMessage({
                id: 'header.ecosystem.sub.stake-bnb.name',
              }),
              desc: formatMessage({
                id: 'header.ecosystem.sub.stake-bnb.desc',
              }),
              target: '_self',
              link: `https://www.bnbchain.org/en/bnb-staking`,
              analyticsId: ANALYTICS_IDS['ecosystem'].click_menu_ecosystem_staking,
            },
            {
              icon: SafeIcon,
              name: formatMessage({
                id: 'header.ecosystem.sub.stake-bnb-beacon.name',
              }),
              desc: formatMessage({
                id: 'header.ecosystem.sub.stake-bnb-beacon.desc',
              }),
              target: '_self',
              link: `https://www.bnbchain.org/en/staking`,
              // tag: {
              //   name: formatMessage({ id: 'header.solutions.tag.sunset' }),
              //   variant: 'warning',
              //   link: `https://www.bnbchain.org/${locale}/bnb-chain-fusion`,
              //   target: '_self',
              // },
            },
            {
              icon: ConversionPathIcon,
              name: formatMessage({
                id: 'header.ecosystem.sub.bridge.name',
              }),
              desc: formatMessage({
                id: 'header.ecosystem.sub.bridge.desc',
              }),
              link: `https://www.bnbchain.org/${locale}/bnb-chain-bridges`,
              target: '_self',
              analyticsId: ANALYTICS_IDS['ecosystem'].click_menu_ecosystem_bridge,
            },
            {
              icon: WalletIcon,
              name: formatMessage({
                id: 'header.ecosystem.sub.what-is-bnb.name',
              }),
              desc: formatMessage({
                id: 'header.ecosystem.sub.what-is-bnb.desc',
              }),
              link: `https://www.bnbchain.org/${locale}/what-is-bnb`,
              target: '_self',
              analyticsId: ANALYTICS_IDS['ecosystem'].click_menu_ecosystem_what,
            },
          ],
        },
        {
          id: 'Community',
          name: formatMessage({
            id: 'header.community.title',
          }),
          desc: '',
          image: '',
          analyticsId: ANALYTICS_IDS['community'].click_menu_community,
          title: formatMessage({ id: 'header.community.panel.name' }),
          subtitle: formatMessage({ id: 'header.community.panel.desc' }),
          selfLink: `https://www.bnbchain.org/${locale}/community`,
          thumbnailLink: {
            href: `https://www.bnbchain.org/${locale}/community`,
            name: formatMessage({
              id: 'header.community.panel.link.name',
            }),
          },
          thumbnailImage: {
            src: 'https://dex-bin.bnbstatic.com/new/static/images/space/header/community.png',
            alt: formatMessage({
              id: 'header.community.panel.name',
            }),
          },
          thumbnailAnalyticsId: ANALYTICS_IDS['community'].click_menu_community_communityHub,
          children: [
            {
              icon: BlogIcon,
              name: formatMessage({
                id: 'header.community.sub.blog.name',
              }),
              desc: formatMessage({
                id: 'header.community.sub.blog.desc',
              }),
              target: '_blank',
              link: `https://www.bnbchain.org/${locale}/blog`,
              analyticsId: ANALYTICS_IDS['community'].click_menu_community_blog,
            },
            {
              icon: EventIcon,
              name: formatMessage({
                id: 'header.community.sub.events.name',
              }),
              desc: formatMessage({
                id: 'header.community.sub.events.desc',
              }),
              target: '_self',
              link: `https://www.bnbchain.org/${locale}/events`,
              analyticsId: ANALYTICS_IDS['community'].click_menu_community_events,
            },
            {
              icon: ProgramIcon,
              name: formatMessage({
                id: 'header.community.sub.incubation.name',
              }),
              desc: formatMessage({
                id: 'header.community.sub.incubation.desc',
              }),
              target: '_self',
              link: `https://www.bnbchain.org/${locale}/bnb-incubation-alliance`,
              analyticsId: ANALYTICS_IDS['community'].click_menu_community_BNBBuilderAlliance,
            },
            {
              icon: MessageIcon,
              name: formatMessage({
                id: 'header.community.sub.build-and-build.name',
              }),
              desc: formatMessage({
                id: 'header.community.sub.build-and-build.desc',
              }),
              target: '_self',
              link: `https://forum.bnbchain.org`,
              analyticsId: ANALYTICS_IDS['community'].click_menu_community_forum,
            },
            {
              icon: DocumentIcon,
              name: formatMessage({
                id: 'header.community.sub.martians-program.name',
              }),
              desc: formatMessage({
                id: 'header.community.sub.martians-program.desc',
              }),
              target: '_self',
              link: `https://www.bnbchain.org/${locale}/martians-program`,
              analyticsId: ANALYTICS_IDS['community'].click_menu_community_martiansProgram,
            },
            {
              icon: CubeIcon,
              name: formatMessage({
                id: 'header.community.sub.builders-club.name',
              }),
              desc: formatMessage({
                id: 'header.community.sub.builders-club.desc',
              }),
              target: '_self',
              link: `https://www.bnbchain.org/${locale}/builders-club`,
              analyticsId: ANALYTICS_IDS['community'].click_menu_community_buildersClub,
            },
            {
              icon: IdeaIcon,
              name: formatMessage({
                id: 'header.community.sub.space-b.name',
              }),
              desc: formatMessage({
                id: 'header.community.sub.space-b.desc',
              }),
              target: '_self',
              link: `https://www.bnbchain.org/${locale}/space-b`,
              analyticsId: ANALYTICS_IDS['community'].click_menu_community_SpaceB,
            },
            {
              icon: IdeaIcon,
              name: formatMessage({
                id: 'header.community.sub.governance.name',
              }),
              desc: formatMessage({
                id: 'header.community.sub.governance.desc',
              }),
              target: '_self',
              link: `https://www.bnbchain.org/${locale}/bnb-chain-governance`,
              analyticsId: ANALYTICS_IDS['community'].click_menu_community_Governance,
            },
          ],
        },
        {
          id: 'Careers',
          name: formatMessage({
            id: 'header.career.title',
          }),
          desc: '',
          image: '',
          analyticsId: ANALYTICS_IDS['careers'].click_menu_careers,
          children: [
            {
              icon: BNBChainIcon,
              name: formatMessage({
                id: 'header.career.sub.bnb-chain-career.name',
              }),
              desc: formatMessage({
                id: 'header.career.sub.bnb-chain-career.desc',
              }),
              target: '_blank',
              link: `https://jobs.bnbchain.org/companies/bnb-chain#content`,
              analyticsId: ANALYTICS_IDS['careers'].click_menu_careers_BNBChainCareers,
            },
            {
              icon: AppsIcon,
              name: formatMessage({
                id: 'header.career.sub.ecosystem-job.name',
              }),
              desc: formatMessage({
                id: 'header.career.sub.ecosystem-job.desc',
              }),
              target: '_blank',
              link: `https://jobs.bnbchain.org/jobs`,
              analyticsId: ANALYTICS_IDS['careers'].click_menu_careers_EcosystemJobs,
            },
          ],
        },
      ];

  return (
    <>
      <PcMenu data={data} />
      {tablet && <TabletMenu data={data} />}
      {mobile && <MobileMenu data={data} />}
    </>
  );
};

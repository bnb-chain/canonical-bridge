import { Icon, IconProps } from '@bnb-chain/space';

export function NetworkIcon(props: IconProps) {
  return (
    <Icon width="16" height="16" viewBox="0 0 16 16" fill="currentColor" {...props}>
      <mask id="mask0_2473_30846" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_2473_30846)">
        <path
          d="M2.46668 6.66641C2.46668 7.29463 2.57479 7.91685 2.79101 8.53307C3.00723 9.1493 3.33245 9.71941 3.76668 10.2434C3.84957 10.34 3.89318 10.4506 3.89751 10.5754C3.90173 10.7002 3.85895 10.8075 3.76918 10.8972C3.67951 10.9869 3.57118 11.0251 3.44418 11.0119C3.31729 10.9987 3.2124 10.9438 3.12951 10.8472C2.60984 10.2309 2.22329 9.56913 1.96984 8.86191C1.71651 8.15469 1.58984 7.42285 1.58984 6.66641C1.58984 5.90996 1.71651 5.17813 1.96984 4.47091C2.22329 3.76369 2.60984 3.10191 3.12951 2.48557C3.2124 2.38902 3.31729 2.33413 3.44418 2.32091C3.57118 2.30769 3.67951 2.34591 3.76918 2.43557C3.85895 2.52535 3.90173 2.63263 3.89751 2.75741C3.89318 2.88219 3.84957 2.99285 3.76668 3.08941C3.33245 3.61341 3.00723 4.18352 2.79101 4.79974C2.57479 5.41596 2.46668 6.03819 2.46668 6.66641ZM4.66668 6.66641C4.66668 7.0143 4.72201 7.36235 4.83268 7.71057C4.94334 8.05891 5.12051 8.38391 5.36418 8.68557C5.43596 8.78224 5.4729 8.89019 5.47501 9.00941C5.47712 9.12863 5.43334 9.23307 5.34368 9.32274C5.2539 9.41252 5.1494 9.45463 5.03018 9.44907C4.91095 9.44352 4.81201 9.39246 4.73334 9.29591C4.42223 8.90869 4.18718 8.4888 4.02818 8.03624C3.86929 7.58369 3.78984 7.12707 3.78984 6.66641C3.78984 6.20574 3.86929 5.74913 4.02818 5.29657C4.18718 4.84402 4.42223 4.42413 4.73334 4.03691C4.81201 3.94035 4.91095 3.8893 5.03018 3.88374C5.1494 3.87819 5.2539 3.9203 5.34368 4.01007C5.43334 4.09974 5.4754 4.2053 5.46984 4.32674C5.46429 4.44807 5.42351 4.55702 5.34751 4.65357C5.11929 4.94413 4.94873 5.26185 4.83584 5.60674C4.72307 5.95163 4.66668 6.30485 4.66668 6.66641ZM6.48201 12.7817L6.15634 13.7842C6.12045 13.8809 6.06084 13.9602 5.97751 14.0221C5.89418 14.0841 5.80084 14.1151 5.69751 14.1151C5.52651 14.1151 5.3949 14.0504 5.30268 13.9209C5.21034 13.7914 5.18895 13.6445 5.23851 13.4804L7.12184 7.82657C6.93551 7.69246 6.78957 7.52307 6.68401 7.31841C6.57845 7.11363 6.52568 6.8963 6.52568 6.66641C6.52568 6.2553 6.66862 5.9068 6.95451 5.62091C7.2404 5.33502 7.5889 5.19207 8.00001 5.19207C8.41112 5.19207 8.75962 5.33502 9.04551 5.62091C9.3314 5.9068 9.47434 6.2553 9.47434 6.66641C9.47434 6.8963 9.42373 7.11146 9.32251 7.31191C9.22118 7.51235 9.07307 7.68391 8.87818 7.82657L10.7615 13.4804C10.8111 13.6334 10.7914 13.7775 10.7025 13.9126C10.6136 14.0476 10.4837 14.1151 10.3128 14.1151C10.2094 14.1151 10.1154 14.0858 10.0308 14.0272C9.94618 13.9687 9.8859 13.8877 9.85001 13.7842L9.52818 12.7817H6.48201ZM6.81284 11.7817H9.18718L8.00001 8.21757L6.81284 11.7817ZM11.3333 6.66641C11.3333 6.33141 11.277 5.98652 11.1642 5.63174C11.0513 5.27707 10.8752 4.94891 10.6358 4.64724C10.5641 4.55057 10.5271 4.44263 10.525 4.32341C10.5229 4.20419 10.5667 4.09974 10.6563 4.01007C10.7461 3.9203 10.8523 3.87819 10.975 3.88374C11.0977 3.8893 11.1949 3.94035 11.2667 4.03691C11.5709 4.42413 11.8008 4.84507 11.9563 5.29974C12.1119 5.75441 12.1965 6.21207 12.2102 6.67274C12.2102 7.13352 12.1318 7.58907 11.975 8.03941C11.8181 8.48985 11.582 8.90869 11.2667 9.29591C11.188 9.39246 11.0891 9.44352 10.9698 9.44907C10.8506 9.45463 10.7461 9.41252 10.6563 9.32274C10.5667 9.23307 10.5246 9.12752 10.5302 9.00607C10.5357 8.88474 10.5765 8.7758 10.6525 8.67924C10.8807 8.38869 11.0513 8.07096 11.1642 7.72607C11.277 7.38119 11.3333 7.02796 11.3333 6.66641ZM13.5333 6.66641C13.5333 6.03819 13.4252 5.41596 13.209 4.79974C12.9928 4.18352 12.6676 3.61341 12.2333 3.08941C12.1505 2.99285 12.1068 2.88219 12.1025 2.75741C12.0983 2.63263 12.1411 2.52535 12.2308 2.43557C12.3205 2.34591 12.4288 2.30769 12.5558 2.32091C12.6827 2.33413 12.7876 2.38902 12.8705 2.48557C13.3902 3.10191 13.7767 3.76369 14.0302 4.47091C14.2835 5.17813 14.4102 5.90996 14.4102 6.66641C14.4102 7.42285 14.2897 8.15469 14.0487 8.86191C13.8077 9.56913 13.4183 10.2309 12.8807 10.8472C12.791 10.9438 12.6844 11.0004 12.5608 11.0171C12.4374 11.0337 12.3274 10.9938 12.2308 10.8972C12.1411 10.8075 12.0983 10.7002 12.1025 10.5754C12.1068 10.4506 12.1505 10.34 12.2333 10.2434C12.6676 9.71941 12.9928 9.1493 13.209 8.53307C13.4252 7.91685 13.5333 7.29463 13.5333 6.66641Z"
          fill="#E55F00"
        />
      </g>
    </Icon>
  );
}
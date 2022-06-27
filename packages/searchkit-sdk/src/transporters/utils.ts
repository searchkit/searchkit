import { CloudHost } from '..'

export function getHostFromCloud(cloud: CloudHost): string {
  const { id } = cloud
  // the cloud id is `cluster-name:base64encodedurl`
  // the url is a string divided by two '$', the first is the cloud url
  // the second the elasticsearch instance, the third the kibana instance
  const cloudUrls = atob(id.split(':')[1]).split('$')
  return `https://${cloudUrls[1]}.${cloudUrls[0]}`
}

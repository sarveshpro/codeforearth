import React from "react"
import { graphql } from "gatsby"

import { transformOrganizations } from "../utils/airtable"

import Layout from "../components/layout"
import OrganizationCard from "../components/OrganizationCard"
import IndexHeader from "../components/IndexHeader"
import { useOrganizationFilterState } from "../components/OrganizationFilter"
import SEO from "../components/seo"

const CapitalTemplate = ({
  data: {
    organizations: { nodes },
    site,
  },
}) => {
  const [filter, setFilter, applyFilter] = useOrganizationFilterState()

  let organizations = transformOrganizations(nodes)
  organizations = applyFilter(organizations)

  const { capitalAddFormUrl } = site.siteMetadata

  return (
    <Layout contentClassName="bg-gray-100 px-3 sm:px-6">
      <SEO
        title="Climate Capital on Climatescape"
        description="Find climate-friendly VCs, grants, project finance, and more on Climatescape"
      />

      <div className="max-w-3xl mx-auto pb-4">
        <IndexHeader
          title="Climate Capital"
          buttonText="Add"
          buttonUrl={capitalAddFormUrl}
          filter={filter}
          onClearFilter={() => setFilter.none()}
        />

        <div>
          {organizations.map(organization => (
            <OrganizationCard
              key={organization.title}
              organization={organization}
              currentFilter={filter}
              onApplyFilter={setFilter}
            />
          ))}
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query CapitalPageQuery {
    organizations: allAirtable(
      filter: {
        table: { eq: "Organizations" }
        data: { Role: { eq: "Capital" } }
      }
    ) {
      nodes {
        ...CapitalOrganizationCard
      }
    }
    site {
      siteMetadata {
        capitalAddFormUrl
      }
    }
  }
`

export default CapitalTemplate

<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:dd="DynamicDocumentation"
	exclude-result-prefixes="xsl xs fn n cdocfx">

	<!-- Comment out this line to debug --> <xsl:import href="/cernerbasiccontent/formats/medscommon.xslt"/>
	<!-- Uncomment this line to debug  <xsl:import href="MedsCommon.xslt"/> -->

	<xsl:variable name="NoInpatientMeds" as="xs:string">
		<xsl:value-of select="'No active inpatient medications'"/>
	</xsl:variable>
	<xsl:variable name="NoHomeMeds" as="xs:string">
		<xsl:value-of select="'No active home medications'"/>
	</xsl:variable>
	<xsl:variable name="sCatTitleInpatient" as="xs:string">
		<xsl:value-of select="'Inpatient'"/>
	</xsl:variable>
	<xsl:variable name="sCatTitleHome" as="xs:string">
		<xsl:value-of select="'Home'"/>
	</xsl:variable>

	<!-- medsOrderCategory defines category of medication orders.
		Element and attributes:
		category: contains all elements of a category
		category/@type: identify type of this category. Do NOT modify.
		category/title: the header text of this category
		category/substitute: the substitute text displays when no order in this category
		category/originallyOrderedAsTypes: Contains all order types that belongs to this category
		category/originallyOrderedAsTypes/@key: order type that defined in schema, report_data.xsd. Keep them up to date when upgrading MSVC data-extract -->
	<xsl:variable name="medsOrderCategory">
		<category type="inpatient"> <!-- inpatient category -->
			<title><xsl:value-of select="$sCatTitleInpatient"/></title> <!-- heading text of this category -->
			<substitute><xsl:value-of select="$NoInpatientMeds"/></substitute> <!-- substitute text displays when no meds order in this category -->
			<originallyOrderedAsTypes> <!-- Types of meds order that belong to this category -->
				<type key="NORMAL"/>
				<type key="PHARMACY_CHARGE_ONLY"/>
				<type key="SATELLITE"/>
			</originallyOrderedAsTypes>
		</category>
		<category type="home"> <!-- home category -->
			<title><xsl:value-of select="$sCatTitleHome"/></title>
			<substitute><xsl:value-of select="$NoHomeMeds"/></substitute>
			<originallyOrderedAsTypes>
				<type key="PRESCRIPTION"/>
				<type key="DOCUMENTED"/>
				<type key="PATIENTS_OWN_MEDS"/>
			</originallyOrderedAsTypes>
		</category>
	</xsl:variable>

	<!-- Detect if any of given type matches one of the given list of types -->
	<!-- Parameters: -->
	<!-- 	sType - the string of a type -->
	<!--	typeList - array of types -->
	<xsl:function name="cdocfx:isTypeOf" as="xs:boolean">
		<xsl:param name="sType"/>
		<xsl:param name="typeList"/>
		<xsl:choose>
			<xsl:when test="$sType">
				<xsl:value-of select="fn:exists(fn:index-of($typeList,$sType))"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="fn:false()"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>

	<!-- Format the substitute text for category that has no meds order -->
	<xsl:template match="substitute">
		<xsl:if test="fn:last()=1"> <!-- Only output substitute text when no meds order in this list -->
			<div style="margin-left: 1em; padding-left: 1em; text-indent: -1em;">
				<xsl:value-of select="."/>
			</div>
		</xsl:if>
	</xsl:template>

	<xsl:template match="/">
		<xsl:variable name="report" select="n:report"/>

		<!-- Output orders by category -->
		<xsl:for-each select="$medsOrderCategory/category">
			<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
				<!-- category header text -->
				<u>
					 <xsl:value-of select="./title"/>
				</u>
				<!-- output orders in this category, sorted by clinical name of the order -->
				<xsl:variable name="category" select="."/>
				<xsl:apply-templates select="$report/n:clinical-data/n:order-data/n:medication-order[cdocfx:isTypeOf(@originally-ordered-as-type, $category/originallyOrderedAsTypes/type/@key)] | $category/substitute">
					<xsl:sort select="fn:upper-case(@clinical-name)"/>
				</xsl:apply-templates>
			</div>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>

<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
	xmlns:dd="DynamicDocumentation"
	xmlns:java-string="java:java.lang.String"
	exclude-result-prefixes="xsl xs n doc dd java-string">

	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>
	
	<!-- required to include CommonFxn.xslt -->
	<!-- Comment this line to debug --> <xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt" />
	<!-- Uncomment this line to debug <xsl:include href="commonfxn.xslt" /> -->
	
	<xsl:variable name="StopTaking" as="xs:string">
		<xsl:value-of select="'Stop taking these medications'"/>
	</xsl:variable>
	
	<xsl:variable name="ContactPhysician" as="xs:string">
		<xsl:value-of select="'Contact prescribing physician if questions or concerns'"/>
	</xsl:variable>
	
	<xsl:template name="DisplayMed">
		<xsl:param name="Med"/>
		
		<li class="ddemrcontentitem ddremovable" dd:btnfloatingstyle="top-right">
			<xsl:attribute name="dd:entityid">
				<xsl:if test="$Med/@order-id">
					<xsl:value-of select="$Med/@order-id"/>
				</xsl:if>
			</xsl:attribute>
			<xsl:attribute name="dd:contenttype">
				<xsl:text>MEDS_REC</xsl:text>
			</xsl:attribute>
			
			<!-- Med name -->
			<xsl:if test="$Med/@order-name">
				<xsl:value-of select="$Med/@order-name"/>
			</xsl:if>
		</li>
	</xsl:template>
	
	<xsl:template match="/">
		<xsl:if test="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order">

			<xsl:variable name="sortedMeds">
				<xsl:for-each select="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order">
					<xsl:sort select="@order-name" data-type="text" order="ascending"/>
					
					<xsl:copy-of select="."/>
				</xsl:for-each>
			</xsl:variable>
			
			<!-- New/Continue/Continue with Changes -->
			<xsl:if test="$sortedMeds/n:reconciliation-report-order[@report-order-type='FILL' or @report-order-type='CONTINUE' or @report-order-type='CONTINUE_WITH_CHANGES']">
				<ul style="padding-left: 15px; margin-top: 0px;">
					<xsl:for-each select="$sortedMeds/n:reconciliation-report-order[@report-order-type='FILL' or @report-order-type='CONTINUE' or @report-order-type='CONTINUE_WITH_CHANGES']">
						<xsl:call-template name="DisplayMed">
							<xsl:with-param name="Med" select="."/>
						</xsl:call-template>
					</xsl:for-each>
				</ul>
			</xsl:if>
			
			<!-- Contact physician -->
			<xsl:if test="$sortedMeds/n:reconciliation-report-order[@report-order-type='CONTACT_PHYSICIAN']">
				<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
					<strong style="font-size:13pt;">
						<xsl:value-of select="$ContactPhysician"/>
					</strong>
					
					<ul style="padding-left: 15px; margin-top: 0px;">
						<xsl:for-each select="$sortedMeds/n:reconciliation-report-order[@report-order-type='CONTACT_PHYSICIAN']">
							<xsl:call-template name="DisplayMed">
								<xsl:with-param name="Med" select="."/>
							</xsl:call-template>
						</xsl:for-each>
					</ul>
				</div>
			</xsl:if>
			
			<!-- Stop Taking -->
			<xsl:if test="$sortedMeds/n:reconciliation-report-order[@report-order-type='STOP']">
				<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
					<!-- FUTURE: Add alternate text and src to i18n files for correctly translating the image for other locales. -->
					<img alt="STOP" style="margin-right: .5em; vertical-align: middle;" src="data:image/png;base64,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"/>
					
					<strong style="font-size:13pt; vertical-align: middle;">
						<xsl:value-of select="$StopTaking"/>
					</strong>
					
					<ul style="padding-left: 15px; margin-top: 0px;">
						<xsl:for-each select="$sortedMeds/n:reconciliation-report-order[@report-order-type='STOP']">
							<xsl:call-template name="DisplayMed">
								<xsl:with-param name="Med" select="."/>
							</xsl:call-template>
						</xsl:for-each>
					</ul>
				</div>
			</xsl:if>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
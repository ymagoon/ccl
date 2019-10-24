<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema" 
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:extfx="urn:com-cerner-physician-documentation-extension-functions"
	xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
	xmlns:dd="DynamicDocumentation"
	xmlns:java-string="java:java.lang.String"
	exclude-result-prefixes="xsl xs fn n cdocfx xr-date-formatter extfx doc dd java-string">

	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>
	
	<!-- required to include CommonFxn.xslt -->
	<!-- Comment this line to debug --> <xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt" />
	<!-- Uncomment this line to debug <xsl:include href="commonfxn.xslt" /> -->

	<!-- Default string constants -->
	<xsl:variable name="attendingDocCDFMeaning" as="xs:string" select="'ATTENDDOC'"/>
	<xsl:variable name="primaryCareDocCDFMeaning" as="xs:string" select="'PCP'"/>
	<xsl:variable name="patientProviders" select="n:report/n:demographics/n:patient-info/n:patient-provider"/>
	<xsl:variable name="encounterProviders" select="n:report/n:demographics/n:encounter-info/n:provider"/>

	<!-- Default string constants -->
	<xsl:variable name="MRN" as="xs:string">
		<xsl:value-of select="'MRN:'"/>
	</xsl:variable>
	
	<xsl:variable name="FIN" as="xs:string">
		<xsl:value-of select="'FIN:'"/>
	</xsl:variable>
	
	<xsl:variable name="Location" as="xs:string">
		<xsl:value-of select="'Location:'"/>
	</xsl:variable>
	
	<xsl:variable name="RegDtTm" as="xs:string">
		<xsl:value-of select="'Registration Date and Time:'"/>
	</xsl:variable>
	
	<xsl:variable name="PCP" as="xs:string">
		<xsl:value-of select="'Primary Care Physician:'"/>
	</xsl:variable>

	<xsl:variable name="AttendingPhysician" as="xs:string">
		<xsl:value-of select="'Attending Physician:'"/>
	</xsl:variable>

	<xsl:variable name="CommaSeparator" as="xs:string">
		<xsl:value-of select="', %s'"/>
	</xsl:variable>
	
	<xsl:variable name="DATE_SEQUENCE_UTC_ON" as="xs:string" select="'MM/dd/yyyy HH:mm zzz'"/>
	<xsl:variable name="DATE_SEQUENCE_UTC_OFF" as="xs:string" select="'MM/dd/yyyy HH:mm'"/>
	
	<!-- This will be over-written during Run-Time -->
	<xsl:variable name="bIsUTCOn" as="xs:boolean" select="true()"/>
	
	<!-- This is a derived variable and doesn't need to go in the i18n string tables -->
	<xsl:variable name="DATE_SEQUENCE" as="xs:string" select="cdocfx:getDateDisplayPattern($bIsUTCOn, $DATE_SEQUENCE_UTC_ON, $DATE_SEQUENCE_UTC_OFF)"/>
	
	<!-- Keys -->
	<xsl:key name="keyCode" match="n:report/n:code-list/n:code" use="@code"/>
	<xsl:key name="keyPersonnel" match="n:report/n:personnel-list/n:personnel" use="@prsnl-id"/>

	<xsl:template name="displayProviderInfo">
		<xsl:param name="providerCDFMeaning" as="xs:string"/>
		<xsl:param name="providerElements"/>
		<xsl:param name="title"/>
		<div style="clear:both; overflow:hidden;" class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
			<div style="float:left;">
				<xsl:value-of select="$title"/>
			</div>
			<div style="float:left; margin-left:1ex;">
				<xsl:for-each select="$providerElements">
					<xsl:sort select="key('keyPersonnel', @prsnl-id)/n:provider-name/@name-last"/>

					<xsl:if test="@relation-code">
						<xsl:if test="key('keyCode', @relation-code)/@meaning=$providerCDFMeaning">
							<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
								<!-- @name-full is a required field -->
								<xsl:value-of select="key('keyPersonnel', @prsnl-id)/n:provider-name/@name-full" />
								<xsl:if test="key('keyPersonnel', @prsnl-id)/@business-phone">
									<xsl:variable name="Phone" as="xs:string">
										<xsl:value-of select="key('keyPersonnel', @prsnl-id)/@business-phone"/>
									</xsl:variable>
									<xsl:value-of select="java-string:format($CommaSeparator, $Phone)"/>
								</xsl:if>
							</div>
						</xsl:if>
					</xsl:if>
				</xsl:for-each>
			</div>
		</div>
	</xsl:template>


	<xsl:template match="/">
		<xsl:variable name="CheckForServiceProvider">
			<xsl:for-each select="$patientProviders">
				<xsl:if test="@relation-code and key('keyCode', @relation-code)/@meaning=$primaryCareDocCDFMeaning">
					<pcp>pcp</pcp>
				</xsl:if>
			</xsl:for-each>
			<xsl:for-each select="$encounterProviders">
				<xsl:if test="@relation-code and key('keyCode', @relation-code)/@meaning=$attendingDocCDFMeaning">
					<attenddoc>attenddoc</attenddoc>
				</xsl:if>
			</xsl:for-each>
		</xsl:variable>
		
		<xsl:variable name="HasPCP" as="xs:boolean">
			<xsl:choose>
				<xsl:when test="$CheckForServiceProvider/pcp">
					<xsl:value-of select="true()"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="false()"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>

		<xsl:variable name="HasAttendingPhysician" as="xs:boolean">
			<xsl:choose>
				<xsl:when test="$CheckForServiceProvider/attenddoc">
					<xsl:value-of select="true()"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="false()" />
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<xsl:if test="n:report/n:clinical-data/n:encounter-data/n:encounter">
			<!-- Only the current encounter will be returned. We can safely assume that there is only one <encounter> element. -->
			<div class="ddemrcontentitem ddremovable" dd:btnfloatingstyle="top-right">
				<xsl:attribute name="dd:entityid">
					<xsl:if test="n:report/n:clinical-data/n:encounter-data/n:encounter/@encounter-id">
						<xsl:value-of select="n:report/n:clinical-data/n:encounter-data/n:encounter/@encounter-id"/>
					</xsl:if>
				</xsl:attribute>
				<xsl:attribute name="dd:contenttype">
					<xsl:text>ENCNTRINFO</xsl:text>
				</xsl:attribute>
				
				<xsl:if test="n:report/n:clinical-data/n:encounter-data/n:encounter/@mrn">
					<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
						<xsl:value-of select="$MRN"/>
						<span style="margin-left:1ex;"><xsl:value-of select="n:report/n:clinical-data/n:encounter-data/n:encounter/@mrn"/></span>
					</div>
				</xsl:if>
				
				<xsl:if test="n:report/n:clinical-data/n:encounter-data/n:encounter/@fin">
					<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">	
						<xsl:value-of select="$FIN"/>
						<span style="margin-left:1ex;"><xsl:value-of select="n:report/n:clinical-data/n:encounter-data/n:encounter/@fin"/></span>
					</div>	
				</xsl:if>
				
				<xsl:if test="n:report/n:clinical-data/n:encounter-data/n:encounter/n:client/@name">
					<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">	
						<xsl:value-of select="$Location"/>
						<span style="margin-left:1ex;"><xsl:value-of select="n:report/n:clinical-data/n:encounter-data/n:encounter/n:client/@name"/></span>
					</div>	
				</xsl:if>
				
				<xsl:if test="n:report/n:clinical-data/n:encounter-data/n:encounter/n:registration-dt-tm">
					<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
						<xsl:value-of select="$RegDtTm"/>							
						<xsl:variable name="DateTime" as="xs:dateTime" select="n:report/n:clinical-data/n:encounter-data/n:encounter/n:registration-dt-tm"/>
						<xsl:variable name="TimeZone" as="xs:string" select="n:report/n:clinical-data/n:encounter-data/n:encounter/n:registration-dt-tm/@time-zone"/>
						<span style="margin-left:1ex;"><xsl:value-of select="xr-date-formatter:formatDate($DateTime, $DATE_SEQUENCE, $TimeZone, $current-locale)"/></span>
					</div>	
				</xsl:if>
				
				<!-- @relation-code will be used to look up PCP (primary care physician). @relation-code is an optional attribute, so we need to check it before emitting the row for PCP. -->
				<xsl:if test="$HasPCP">
					<xsl:call-template name="displayProviderInfo">
						<xsl:with-param name="providerCDFMeaning" select="$primaryCareDocCDFMeaning"/>
						<xsl:with-param name="providerElements" select="$patientProviders"/>
						<xsl:with-param name="title" select="$PCP"/>
					</xsl:call-template>
				</xsl:if>

				<xsl:if test="$HasAttendingPhysician">
					<xsl:call-template name="displayProviderInfo">
						<xsl:with-param name="providerCDFMeaning" select="$attendingDocCDFMeaning"/>
						<xsl:with-param name="providerElements" select="$encounterProviders"/>
						<xsl:with-param name="title" select="$AttendingPhysician"/>
					</xsl:call-template>
				</xsl:if>
			</div>
		</xsl:if>
	</xsl:template>
	
</xsl:stylesheet>